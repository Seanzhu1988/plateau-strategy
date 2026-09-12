"""Background museum research and writing, with isolated data and no network."""
import json
import os
import sys
import tempfile
import unittest
from types import SimpleNamespace
from unittest import mock

# This module disables workers and clears paid-provider keys before app import.
from test_gallery_journey import site
import gallery_archive as archive
import gallery_reader as reader


CONTEXT = "This isolated museum fixture records a vessel made for communal ceremonies."
STORY = ("This is an isolated background-writing fixture. Look at the vessel and "
         "notice its shape. The saved research and catalogue identify the same "
         "object. This narrative proves that a finished story can be shared with "
         "the next visitor without another generation request. ") * 2


def museum_facts(oid=101, provider="aic", **changes):
    oid = str(oid)
    museum, source_url = {
        "aic": ("Art Institute of Chicago", "https://www.artic.edu/artworks/" + oid),
        "met": ("The Met, New York", "https://www.metmuseum.org/art/collection/search/" + oid),
    }[provider]
    facts = {
        "title": "Background fixture vessel " + oid,
        "artist": "Fixture maker",
        "museum": museum,
        "source": museum,
        "provider": provider,
        "source_object_id": oid,
        "source_url": source_url,
        "research_source_url": source_url,
        "item_number": "FIXTURE-" + oid,
        "date": "1200",
        "medium": "Bronze",
        "culture": "Fixture culture",
        "period": "Fixture period",
        "dimensions": "Twenty centimetres tall",
        "credit_line": "Fixture collection gift",
        "historical_context": CONTEXT if provider == "aic" else "",
        "research_provider": "official museum catalogue",
        "researched_at": 200,
        "catalogue_observed_at": 200,
    }
    facts.update(changes)
    return facts


class BackgroundGalleryTests(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory(prefix="gallery-background-test-")
        self.addCleanup(self.data.cleanup)
        patcher = mock.patch.dict(os.environ, {
            "DATA_DIR": self.data.name, "ANTHROPIC_API_KEY": "",
            "DISCOVERY_ENABLED": "false", "DISPATCH_REMINDERS": "false",
        })
        patcher.start()
        self.addCleanup(patcher.stop)
        patcher = mock.patch.object(archive, "BASE_DIR", self.data.name)
        patcher.start()
        self.addCleanup(patcher.stop)
        # Fail any accidental real HTTP operation, not merely paid generation.
        patcher = mock.patch("requests.sessions.Session.request",
                             side_effect=AssertionError("Network prohibited by test"))
        patcher.start()
        self.addCleanup(patcher.stop)
        site.app.config["TESTING"] = True
        self.client = site.app.test_client()

    def save_story(self, artifact_id, lang="en"):
        reservation = archive.reserve(artifact_id, lang, 20)
        self.assertEqual(reservation["status"], "reserved")
        self.assertTrue(archive.finish(artifact_id, lang, reservation["token"],
                                       STORY, 3, "isolated-test",
                                       research=archive.research_source(archive.generation_facts(artifact_id))))

    def test_background_discoveries_deduplicate_without_inventing_visitor_demand(self):
        first = archive.queue_background(museum_facts())
        second = archive.queue_background(museum_facts())
        self.assertTrue(first["queued"])
        self.assertFalse(second["queued"])
        self.assertEqual(second["reason"], "already_queued")
        self.assertEqual(first["artifact_id"], second["artifact_id"])
        with archive.database() as db:
            row = db.execute("SELECT demand_count,confirmed_count FROM artifacts").fetchone()
            self.assertEqual(tuple(row), (0, 0))
            self.assertEqual(db.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0], 1)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM writing_queue").fetchone()[0], 1)
            for table in ("queries", "query_artifacts", "writing_requests", "generation_spend"):
                self.assertEqual(db.execute("SELECT COUNT(*) FROM " + table).fetchone()[0], 0)
        self.assertEqual(archive.get_artifact(first["artifact_id"])["discovery_origin"],
                         "museum_highlights")

    def test_saved_english_story_does_not_create_background_work(self):
        artifact_id = archive.remember(museum_facts())["artifact_id"]
        self.save_story(artifact_id)
        result = archive.queue_background(museum_facts())
        self.assertEqual(result["reason"], "cached")
        self.assertFalse(result["queued"])
        self.assertEqual(archive.queue_status()["items"], [])

    def test_requested_language_precedes_an_older_background_job(self):
        background = archive.queue_background(museum_facts(101))["artifact_id"]
        visitor = archive.enrich([museum_facts(102)])["results"][0]["artifact_id"]
        archive.confirm(visitor, "zh")

        def write(facts, lang):
            self.save_story(facts["artifact_id"], lang)
            return archive.get_story(facts["artifact_id"], lang)

        with mock.patch.object(reader, "available", return_value=True), \
                mock.patch.object(reader, "read_for", side_effect=write) as called:
            result = archive.process_next()
        self.assertEqual(result["status"], "complete")
        self.assertEqual(called.call_args.args[0]["artifact_id"], visitor)
        self.assertEqual(called.call_args.args[1], "zh")
        self.assertIsNone(archive.get_story(background, "en"))

    def test_real_search_demand_precedes_background_even_without_confirmation(self):
        background = archive.queue_background(museum_facts(101))["artifact_id"]
        visitor = archive.enrich([museum_facts(102)])["results"][0]["artifact_id"]
        with mock.patch.object(reader, "available", return_value=True), \
                mock.patch.object(reader, "read_for", return_value={"reason": "failed"}) as called:
            archive.process_next()
        self.assertEqual(called.call_args.args[0]["artifact_id"], visitor)
        self.assertNotEqual(visitor, background)

    def test_invalid_or_mismatched_official_source_never_enters_queue(self):
        invalid = [
            {"research_source_url": "https://example.org/artworks/101"},
            {"research_source_url": "https://www.artic.edu.example.org/artworks/101"},
            {"research_source_url": "https://www.artic.edu/artworks/999"},
            {"research_source_url": "http://www.artic.edu/artworks/101"},
            {"research_source_url": "https://www.artic.edu/artworks/101/other"},
            {"source_object_id": "../101"},
            {"provider": "unverified"},
        ]
        for changes in invalid:
            with self.subTest(changes=changes):
                facts = museum_facts()
                facts.update(changes)
                result = archive.queue_background(facts)
                self.assertFalse(result["queued"])
                self.assertEqual(result["reason"], "insufficient_evidence")
        self.assertEqual(archive.archive()["stats"]["artifacts"], 0)

    def test_missing_identity_date_or_research_is_rejected(self):
        for changes in ({"title": ""}, {"item_number": ""}, {"date": ""},
                        {"medium": "", "historical_context": ""}):
            with self.subTest(changes=changes):
                self.assertEqual(archive.queue_background(museum_facts(**changes))["reason"],
                                 "insufficient_evidence")
        self.assertEqual(archive.queue_status()["items"], [])

    def test_private_context_reaches_writer_but_is_not_in_public_artifact(self):
        artifact_id = archive.queue_background(museum_facts())["artifact_id"]
        public = self.client.get("/api/gallery/artifacts/" + artifact_id)
        self.assertEqual(public.status_code, 200)
        body = public.get_json()
        self.assertNotIn("historical_context", body["artifact"])
        self.assertNotIn(CONTEXT, json.dumps(body))
        facts = archive.generation_facts(artifact_id)
        self.assertEqual(facts["historical_context"], CONTEXT)
        prompt = reader._prompt(facts, "zh")
        self.assertIn(CONTEXT, prompt)
        self.assertIn(facts["research_source_url"], prompt)
        self.assertIn("Simplified Chinese", prompt)
        for key in ("medium", "culture", "period", "dimensions", "credit_line"):
            self.assertIn(facts[key], prompt)
        self.assertIsNone(archive.generation_facts("a_missing"))

    def test_writer_uses_private_persisted_research_not_request_supplied_context(self):
        artifact_id = archive.queue_background(museum_facts())["artifact_id"]
        response = mock.Mock()
        response.json.return_value = {"stop_reason": "end_turn", "content": [{"type": "text", "text": STORY}]}
        fake_requests = SimpleNamespace(post=mock.Mock(return_value=response))
        with mock.patch.object(reader, "available", return_value=True), \
                mock.patch.object(reader, "requests", fake_requests):
            result = reader.read_for({"artifact_id": artifact_id,
                                      "historical_context": "Invented visitor instructions"}, "en")
        self.assertEqual(result["text"], STORY.strip())
        prompt = fake_requests.post.call_args.kwargs["json"]["messages"][0]["content"]
        self.assertIn(CONTEXT, prompt)
        self.assertNotIn("Invented visitor instructions", prompt)
        self.assertEqual(archive.get_artifact(artifact_id)["writing_status"], "complete")
        self.assertNotIn(CONTEXT, json.dumps(archive.archive()))

    def test_unverified_context_is_excluded_from_prompt(self):
        facts = museum_facts(research_source_url="https://example.org/unverified")
        self.assertNotIn(CONTEXT, reader._facts_block(facts))
        self.assertNotIn("Historical source:", reader._facts_block(facts))

    def test_truncated_or_refused_writing_is_not_published_and_attempts_stay_counted(self):
        artifact_id = archive.queue_background(museum_facts())["artifact_id"]
        for stop_reason in ("max_tokens", "refusal"):
            with self.subTest(stop_reason=stop_reason):
                response = mock.Mock()
                response.json.return_value = {
                    "stop_reason": stop_reason,
                    "content": [{"type": "text", "text": STORY}],
                }
                with mock.patch.object(reader, "available", return_value=True), \
                        mock.patch.object(reader, "requests", SimpleNamespace(post=mock.Mock(return_value=response))):
                    result = reader.read_for({"artifact_id": artifact_id}, "en")
                self.assertEqual(result["reason"], "failed")
                self.assertIsNone(archive.get_story(artifact_id))
                self.assertEqual(archive.archive()["total"], 0)
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT SUM(attempted) FROM generation_spend").fetchone()[0], 2)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM generation_leases").fetchone()[0], 0)

    def test_only_finished_text_blocks_enter_the_story(self):
        artifact_id = archive.queue_background(museum_facts())["artifact_id"]
        response = mock.Mock()
        response.json.return_value = {
            "stop_reason": "end_turn",
            "content": [
                {"type": "thinking", "text": "Private provider reasoning"},
                {"type": "text", "text": STORY},
            ],
        }
        with mock.patch.object(reader, "available", return_value=True), \
                mock.patch.object(reader, "requests", SimpleNamespace(post=mock.Mock(return_value=response))):
            result = reader.read_for({"artifact_id": artifact_id}, "en")
        self.assertEqual(result["text"], STORY.strip())
        self.assertNotIn("Private provider reasoning", archive.get_story(artifact_id)["text"])

    def test_missing_or_null_completion_reason_is_not_a_finished_story(self):
        artifact_id = archive.queue_background(museum_facts())["artifact_id"]
        payloads = [
            {"content": [{"type": "text", "text": STORY}]},
            {"stop_reason": None, "content": [{"type": "text", "text": STORY}]},
        ]
        for payload in payloads:
            with self.subTest(payload_keys=list(payload)):
                response = mock.Mock()
                response.json.return_value = payload
                with mock.patch.object(reader, "available", return_value=True), \
                        mock.patch.object(reader, "requests", SimpleNamespace(post=mock.Mock(return_value=response))):
                    result = reader.read_for({"artifact_id": artifact_id}, "en")
                self.assertEqual(result["reason"], "failed")
                self.assertIsNone(archive.get_story(artifact_id))
                self.assertEqual(archive.archive()["total"], 0)
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT SUM(attempted) FROM generation_spend").fetchone()[0], 2)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM generation_leases").fetchone()[0], 0)

    def test_source_attribution_distinguishes_description_from_cc0_catalogue(self):
        cases = [
            (museum_facts(), "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"),
            (museum_facts(historical_context=""), "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"),
            (museum_facts(provider="met"), "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"),
        ]
        for facts, license_name, license_url in cases:
            with self.subTest(provider=facts["provider"], license=license_name):
                evidence = archive.research_source(facts)
                self.assertEqual(evidence["license"], license_name)
                self.assertEqual(evidence["license_url"], license_url)
                self.assertEqual(evidence["url"], facts["research_source_url"])
                self.assertTrue(evidence["adapted"])
        artifact_id = archive.queue_background(museum_facts())["artifact_id"]
        self.save_story(artifact_id)
        artifact = self.client.get("/api/gallery/artifacts/" + artifact_id).get_json()["artifact"]
        story = self.client.get("/api/gallery/artifacts/" + artifact_id + "/story").get_json()
        self.assertEqual(artifact["research_source"]["license"], "CC BY 4.0")
        self.assertEqual(story["research_source"], artifact["research_source"])

    def test_existing_editorial_or_ai_story_does_not_acquire_later_scout_attribution(self):
        for oid, kind in ((101, "editorial"), (102, "ai_assisted")):
            with self.subTest(kind=kind):
                facts = museum_facts(oid)
                for key in ("historical_context", "research_source_url", "research_provider", "researched_at"):
                    facts.pop(key)
                artifact_id = archive.remember(facts)["artifact_id"]
                if kind == "editorial":
                    with archive.database() as db:
                        archive._story_put(db, artifact_id, "en", STORY, 3, kind)
                else:
                    self.save_story(artifact_id)
                result = archive.queue_background(museum_facts(oid, researched_at=300))
                self.assertEqual(result["reason"], "cached")
                self.assertIsNotNone(archive.research_source(archive.generation_facts(artifact_id)))
                artifact = self.client.get("/api/gallery/artifacts/" + artifact_id).get_json()["artifact"]
                story = self.client.get("/api/gallery/artifacts/" + artifact_id + "/story").get_json()
                self.assertEqual(story["provenance"]["kind"], kind)
                self.assertEqual(story["text"], STORY)
                self.assertIsNone(story["research_source"])
                self.assertIsNone(artifact["research_source"])

    def test_story_source_snapshot_does_not_change_with_later_artifact_research(self):
        artifact_id = archive.queue_background(museum_facts(historical_context=""))["artifact_id"]
        self.save_story(artifact_id)
        original = archive.get_story(artifact_id)["research_source"]
        self.assertEqual(original["license"], "CC0")
        archive.remember(museum_facts(researched_at=300, catalogue_observed_at=300))
        self.assertEqual(archive.research_source(archive.generation_facts(artifact_id))["license"], "CC BY 4.0")
        self.assertEqual(archive.get_story(artifact_id)["research_source"], original)
        self.assertEqual(archive.get_artifact(artifact_id)["research_source"], original)

    def test_writer_snapshots_the_evidence_used_before_an_inflight_research_update(self):
        artifact_id = archive.queue_background(museum_facts(historical_context=""))["artifact_id"]
        original = archive.research_source(archive.generation_facts(artifact_id))

        def respond_after_source_update(*args, **kwargs):
            self.assertNotIn(CONTEXT, kwargs["json"]["messages"][0]["content"])
            archive.remember(museum_facts(researched_at=300, catalogue_observed_at=300))
            response = mock.Mock()
            response.json.return_value = {"stop_reason": "end_turn", "content": [{"type": "text", "text": STORY}]}
            return response

        with mock.patch.object(reader, "available", return_value=True), \
                mock.patch.object(reader, "requests", SimpleNamespace(post=mock.Mock(side_effect=respond_after_source_update))):
            result = reader.read_for({"artifact_id": artifact_id}, "en")
        self.assertEqual(result["text"], STORY.strip())
        self.assertEqual(result["research_source"], original)
        self.assertEqual(result["research_source"]["license"], "CC0")
        self.assertEqual(archive.research_source(archive.generation_facts(artifact_id))["license"], "CC BY 4.0")

    def test_two_hundred_pending_jobs_apply_backpressure_without_losing_existing_work(self):
        for oid in range(1000, 1200):
            self.assertTrue(archive.queue_background(museum_facts(oid))["queued"])
        result = archive.queue_background(museum_facts(1200))
        self.assertFalse(result["queued"])
        self.assertEqual(result["reason"], "queue_full")
        with archive.database() as db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0], 200)
            self.assertEqual(db.execute("SELECT COUNT(*) FROM writing_queue").fetchone()[0], 200)
        # The scout cap cannot prevent an actual visitor from asking for a story.
        visitor = archive.remember(museum_facts(1300))["artifact_id"]
        self.assertEqual(archive.confirm(visitor, "fr")["writing_status"], "pending")

    def test_researched_metadata_survives_an_older_catalogue_refresh(self):
        original = museum_facts()
        artifact_id = archive.queue_background(original)["artifact_id"]
        stale = museum_facts(title="Outdated title", medium="Outdated material",
                             historical_context="Outdated research", catalogue_observed_at=100,
                             researched_at=100)
        archive.remember(stale)
        refreshed = archive.generation_facts(artifact_id)
        for key in ("title", "medium", "culture", "period", "dimensions", "credit_line",
                    "historical_context", "research_source_url", "research_provider", "researched_at"):
            self.assertEqual(refreshed[key], original[key], key)

    def test_new_research_can_enrich_fresh_catalogue_without_rolling_back_rights(self):
        current = museum_facts(catalogue_observed_at=300, where="Gallery 300",
                               copyright=True, image="", images=[])
        for key in ("historical_context", "research_source_url", "research_provider", "researched_at"):
            current.pop(key)
        artifact_id = archive.remember(current)["artifact_id"]
        researched = museum_facts(catalogue_observed_at=200, researched_at=400,
                                  where="Gallery 200", copyright=False,
                                  image="https://example.org/stale-image.jpg",
                                  images=["https://example.org/stale-image.jpg"])
        self.assertTrue(archive.queue_background(researched)["queued"])
        saved = archive.generation_facts(artifact_id)
        self.assertEqual(saved["historical_context"], CONTEXT)
        self.assertEqual(saved["researched_at"], 400)
        self.assertEqual(saved["research_source_url"], researched["research_source_url"])
        self.assertEqual(saved["discovery_origin"], "museum_highlights")
        self.assertEqual(saved["where"], "Gallery 300")
        self.assertEqual(saved["catalogue_observed_at"], 300)
        self.assertTrue(saved["copyright"])
        self.assertFalse(saved.get("image"))
        self.assertFalse(saved.get("images"))

    def test_scout_pass_runs_before_the_existing_writer(self):
        calls = []
        scout = SimpleNamespace(run_once=mock.Mock(side_effect=lambda: calls.append("scout") or {"status": "scanned"}))
        with mock.patch.dict(sys.modules, {"gallery_scout": scout}), \
                mock.patch.object(archive, "process_next", side_effect=lambda: calls.append("writer") or {"status": "complete"}):
            result = site._gallery_process_next()
        self.assertEqual(calls, ["scout", "writer"])
        self.assertEqual(result["status"], "complete")
        self.assertEqual(result["automatic_discovery"]["status"], "scanned")

    def test_scout_failure_does_not_stop_visitor_story_writing(self):
        scout = SimpleNamespace(run_once=mock.Mock(side_effect=RuntimeError("source unavailable")))
        with mock.patch.dict(sys.modules, {"gallery_scout": scout}), \
                mock.patch.object(archive, "process_next", return_value={"status": "complete"}) as writer:
            result = site._gallery_process_next()
        writer.assert_called_once_with()
        self.assertEqual(result["status"], "complete")
        self.assertEqual(result["automatic_discovery"]["status"], "failed")


if __name__ == "__main__":
    unittest.main()
