/* PROCEDURAL CONTEXT MODEL, not a scan or survey model.
 * Greg Wyatt's Peace Fountain (1985), Cathedral of St. John the Divine.
 * Author's photographs and iconography:
 * https://gregwyattsculpture.com/bronze/peace-fountain
 * Overall published height: 40 feet, Columbia College Today, Summer 2016:
 * https://www.college.columbia.edu/cct/sites/default/files/pdf/CCT_Summer_2016_web.pdf
 * Site context: cathedral visitor brochure, 2022:
 * https://www.stjohndivine.org/uploads/pages/English-2022-1660843091-1677077902-1680277676.pdf
 *
 * Every component proportion, garden radius, and site offset below is a visual
 * interpretation, NOT a published measurement. Faces, feather arrangement,
 * animal poses, patina and garden planting are simplified. Children's perimeter
 * sculptures are omitted. Only overall height, material, named motifs and the
 * nine-giraffe count are claimed. The cathedral-wide view uses a separate
 * 1,994-face silhouette; the closer framing keeps the sculptural reading.
 * Local coordinates: u south, v west, z up; moon west, sun east.
 */
(function () {
  'use strict';
  window.NYC_FORMS = window.NYC_FORMS || {};
  const S = 0.82;
  const BRONZE = '#647667', EDGE = '#82917a', DEEP = '#354b42';
  const PATINA = '#728979', STONE = '#aaa49a';
  const plus=(a,b)=>a.map((n,i)=>n+b[i]);
  const minus=(a,b)=>a.map((n,i)=>n-b[i]);
  const times=(a,s)=>a.map(n=>n*s);
  const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=a=>times(a,1/(Math.hypot(...a)||1));
  const lerp=(a,b,t)=>a.map((n,i)=>n+(b[i]-n)*t);

  window.makePeaceFountain=function(options={}) {
    const contextDetail=options.detail==='context';
    const siteDetail=options.detail==='site';
    const faces=[], sculptureFaces=[];
    let part='sculpture', giraffes=0;
    const ox=options.standalone?0:-264, oy=options.standalone?0:183;
    const world=p=>[(ox-p[1])*S,(oy+p[0])*S,p[2]*S];
    function emit(points,colour=BRONZE,opts={}) {
      if(points.length<3) return;
      const area=Math.hypot(...cross(minus(points[1],points[0]),minus(points[2],points[0])));
      if(area<1e-9) return;
      const f=window.NYC3D.helpers.face(points.map(world),colour,opts);
      faces.push(f);
      if(part==='sculpture') sculptureFaces.push(f);
    }
    function outward(points,center,colour) {
      const normal=cross(minus(points[1],points[0]),minus(points[2],points[0]));
      const mean=times(points.reduce((a,b)=>plus(a,b),[0,0,0]),1/points.length);
      emit(dot(normal,minus(mean,center))<0?points.slice().reverse():points,colour);
    }
    function ellipsoid(c,r,colour=BRONZE,segs=14,rows=9) {
      if(contextDetail){segs=Math.min(segs,5);rows=Math.min(rows,3);}
      else if(siteDetail){segs=Math.min(segs,6);rows=Math.min(rows,4);}
      function point(i,j){const t=Math.PI*i/rows,a=2*Math.PI*j/segs;return[c[0]+r[0]*Math.sin(t)*Math.cos(a),c[1]+r[1]*Math.sin(t)*Math.sin(a),c[2]+r[2]*Math.cos(t)];}
      for(let i=0;i<rows;i++)for(let j=0;j<segs;j++){
        const a=point(i,j),b=point(i+1,j),c1=point(i+1,j+1),d=point(i,j+1);
        if(i===0)outward([a,b,c1],c,colour);
        else if(i===rows-1)outward([a,b,d],c,colour);
        else outward([a,b,c1,d],c,colour);
      }
    }
    function smooth(knots,steps=5) {
      const result=[];
      for(let i=0;i<knots.length-1;i++)for(let j=0;j<steps;j++){
        const p0=knots[Math.max(0,i-1)],p1=knots[i],p2=knots[i+1],p3=knots[Math.min(knots.length-1,i+2)],t=j/steps;
        result.push(p1.map((_,k)=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t)));
      }
      return result.concat([knots[knots.length-1]]);
    }
    function tube(knots,radius,colour=BRONZE,sides=8,steps=4) {
      if(contextDetail){sides=Math.min(sides,3);steps=1;}
      else if(siteDetail){sides=Math.min(sides,4);steps=1;}
      const path=smooth(knots,steps),rings=[];
      for(let i=0;i<path.length;i++){
        const tangent=unit(minus(path[Math.min(i+1,path.length-1)],path[Math.max(0,i-1)]));
        const axis=Math.abs(tangent[2])<.85?[0,0,1]:[0,1,0];
        const a=unit(cross(tangent,axis)),b=unit(cross(tangent,a));
        const r=typeof radius==='function'?radius(i/(path.length-1)):radius;
        rings.push(Array.from({length:sides},(_,j)=>plus(path[i],plus(times(a,r*Math.cos(j/sides*2*Math.PI)),times(b,r*Math.sin(j/sides*2*Math.PI))))));
      }
      for(let i=0;i<rings.length-1;i++)for(let j=0;j<sides;j++)outward([rings[i][j],rings[i+1][j],rings[i+1][(j+1)%sides],rings[i][(j+1)%sides]],lerp(path[i],path[i+1],.5),colour);
      emit(rings[0].slice().reverse(),colour);emit(rings[rings.length-1],colour);
    }
    function ring(c,rx,ry,rz,r,colour=BRONZE) {
      const n=contextDetail?8:(siteDetail?12:40);
      tube(Array.from({length:n+1},(_,j)=>{const a=j/n*2*Math.PI;return[c[0]+rx*Math.cos(a),c[1]+ry*Math.sin(a),c[2]+rz*Math.sin(a)];}),r,colour,8,1);
    }
    function cylinder(r0,r1,z0,z1,colour) {
      const n=contextDetail?10:(siteDetail?16:48);
      for(let j=0;j<n;j++){
        const a=j/n*2*Math.PI,b=(j+1)/n*2*Math.PI;
        const p=[r0*Math.cos(a),r0*Math.sin(a),z0],q=[r0*Math.cos(b),r0*Math.sin(b),z0],r=[r1*Math.cos(b),r1*Math.sin(b),z1],s=[r1*Math.cos(a),r1*Math.sin(a),z1];
        outward([p,q,r,s],[0,0,(z0+z1)/2],colour);
        emit([[0,0,z1],s,r],colour);
      }
    }
    // Basin and restrained garden context. The basin is deliberately dry.
    part='setting';
    cylinder(18,18,0,.4,'#b6afa1');
    cylinder(15.8,15.8,.4,.9,'#8a877b');
    ring([0,0,1.1],17,17,0,.8,STONE);
    ring([0,0,.94],15.4,15.4,0,.25,'#cbc5b7');
    // A contact shadow on the basin floor, never painted over the sculpture.
    const shadowN=contextDetail?16:48;
    const shadow=Array.from({length:shadowN},(_,j)=>{const a=j/shadowN*2*Math.PI;return[1.5+11*Math.cos(a),1.8+7*Math.sin(a),.92];});
    emit(shadow,'#575e50',{flat:true,opacity:.24,bias:-.1});
    if(!options.standalone){
      for(let i=0;i<6;i++){
        const a=(i+.25)/6*2*Math.PI;
        ellipsoid([23*Math.cos(a),23*Math.sin(a),1.8],[6,4,1.8],i%2?'#7e8b70':'#88977a',14,7);
      }
    }
    part='sculpture';
    cylinder(6.3,6.1,.94,1.7,DEEP);
    // Two broad helical surfaces rather than a generic cylindrical pedestal.
    for(let helix=0;helix<2;helix++){
      const rows=contextDetail?8:(siteDetail?12:44),cols=contextDetail?3:(siteDetail?4:9);
      function p(i,j){
        const t=i/rows,s=j/cols;
        const angle=t*Math.PI*1.55+helix*Math.PI+(s-.5)*1.85;
        const r=3.0+3.1*Math.pow(2*t-1,2)+.25*Math.sin(s*Math.PI);
        return[r*Math.cos(angle),r*Math.sin(angle),1.7+12.2*t];
      }
      for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){
        const points=[p(i,j),p(i+1,j),p(i+1,j+1),p(i,j+1)];
        emit(points,helix?BRONZE:PATINA);
        const inner=points.map(p=>{const r=Math.hypot(p[0],p[1]);return[p[0]*(r-.18)/r,p[1]*(r-.18)/r,p[2]];});
        emit(inner.reverse(),DEEP);
      }
      const edgePoints=rows+1;
      for(const edge of[0,cols])tube(Array.from({length:edgePoints},(_,i)=>p(i,edge)),.12,EDGE,7,1);
    }
    // Four small rising flame motifs around the foot of the pedestal.
    if(!contextDetail)for(let k=0;k<4;k++){
      const a=k*Math.PI/2,tx=Math.cos(a)*9,ty=Math.sin(a)*9;
      for(let j=0;j<3;j++)tube([[tx+(j-1)*.4,ty,1.2],[tx+(j-1)*.7,ty+.3,2.6],[tx+(j-1)*.4,ty-.2,4.3],[tx+(j-1)*.4+.4,ty,5.1-j*.3]],t=>.34*(1-t)+.035,BRONZE,7,3);
    }
    // Crab: broad carapace, curling legs, two open pincers.
    ellipsoid([0,0,15.1],[9.4,6.3,2.2],BRONZE,30,12);
    ring([0,0,15.4],9.1,6.1,0,.23,EDGE);
    for(let side of[-1,1]){
      for(let j=0;j<4;j++)tube([[side*5,1-j*1.3,15],[side*(9+j*.5),3-j*2,14.7],[side*(11+j*.3),4-j*2.3,13.4],[side*(10.7+j*.2),5-j*2.1,14]],t=>.54-.25*t,BRONZE,8,4);
      tube([[side*6,3.5,16],[side*10,5.8,17],[side*10.8,5.8,19.2]],.9,PATINA,10,5);
      ellipsoid([side*10.7,5.7,19.5],[1.7,1.3,1.1],BRONZE);
      tube([[side*11.8,5.9,19.4],[side*13,5.5,21.3],[side*10.5,5.3,22.2]],t=>.75*(1-t)+.06,BRONZE,8,5);
      tube([[side*9.5,5.6,19.8],[side*8.5,5.2,21],[side*9.5,5.2,21.5]],t=>.65*(1-t)+.04,PATINA,8,5);
    }
    // West-facing moon and east-facing sun, modeled on opposite sides.
    ellipsoid([-1,0,22.1],[6.0,3.7,6.0],PATINA,36,20);
    for(let side of[-1,1]){
      const v=side*3.6;
      ellipsoid([-1,v,22.6],[.68,.9,1.55],EDGE,12,9);
      for(let eye of[-1,1]){
        const u=-1+eye*2;
        tube([[u-.75,v-.05*side,23.4],[u,v+.08*side,23.7],[u+.75,v-.05*side,23.45]],.16,DEEP,8,4);
        tube([[u-.83,v-.16*side,24.35],[u,v+.12*side,24.55],[u+.8,v-.08*side,24.2]],.26,EDGE,8,4);
        ellipsoid([u,v-.14*side,21.9],[1,.4,.6],PATINA,12,7);
      }
      tube([[-2.6,v-.06*side,20.55],[-1,v+.05*side,side<0?20.03:20.65],[.6,v-.06*side,20.55]],.16,DEEP,8,5);
    }
    // Three swept celestial bands; their tilt is a visual interpretation.
    for(let i=0;i<3;i++){
      const bandN=contextDetail?10:(siteDetail?32:65);
      const path=Array.from({length:bandN},(_,j)=>{const a=j/(bandN-1)*2*Math.PI;return[-1+(7.1+i*.33)*Math.cos(a),1.7*Math.sin(a)+(i-1)*.42,22.1+4.9*Math.sin(a)+1.55*Math.cos(a)];});
      tube(path,.18+i*.045,i===1?DEEP:EDGE,8,1);
    }
    // Michael: asymmetric, leaning figure with articulated limbs and drapery.
    ellipsoid([4.4,.1,27.2],[1.6,1,2.0],BRONZE,18,12);
    ellipsoid([4.85,.05,29.9],[2.0,1.12,2.05],PATINA,20,12);
    ellipsoid([4.0,1.04,30.15],[.92,.28,.58],PATINA,16,10);
    ellipsoid([5.5,1.03,30.02],[.79,.3,.55],PATINA,16,10);
    for(let k=0;k<3;k++)for(let side of[-1,1])ellipsoid([4.8+side*.35,.99,29.18-k*.55],[.33,.2,.29],BRONZE,12,8);
    ellipsoid([5.85,.1,32.8],[.91,.84,1.12],BRONZE,18,12);
    tube([[5.25,0,31.3],[5.55,.04,32.15]],.62,PATINA,10,3);
    ellipsoid([6.53,.53,32.65],[.5,.39,.29],EDGE,10,7);
    // Small curls keep the head from reading as an anonymous sphere.
    if(!contextDetail)for(let j=0;j<(siteDetail?8:15);j++){
      const a=j/(siteDetail?8:15)*2*Math.PI;
      ellipsoid([5.85+.8*Math.cos(a),.1+.69*Math.sin(a),33.46+.16*Math.sin(a*3)],[.24,.25,.25],j%3?DEEP:BRONZE,8,5);
    }
    tube([[3.5,.7,30.7],[2.8,1.9,28.7],[5.55,2.7,28.65]],t=>.5-.17*t,PATINA,10,5);
    ellipsoid([5.7,2.7,28.7],[.53,.34,.35],EDGE,12,7);
    tube([[6.5,-.1,30.2],[7.2,.6,27.9],[8.1,1.7,25.8]],t=>.56-.22*t,PATINA,10,5);
    ellipsoid([8.1,1.7,25.5],[.38,.37,.6],BRONZE,12,7);
    tube([[3.85,0,26.1],[3.1,1.1,24.6],[4,1.8,23.25]],t=>.75-.38*t,BRONZE,10,5);
    tube([[5.3,-.1,26],[5.8,.2,24.3],[5.6,1.2,22.8]],t=>.65-.32*t,PATINA,10,5);
    ellipsoid([4.25,2.05,23.1],[.85,.45,.27],BRONZE);
    ellipsoid([6,1.4,22.6],[.85,.45,.27],BRONZE);
    if(!contextDetail)for(let k=0;k<(siteDetail?5:10);k++){
      const a=k/(siteDetail?5:10)*2*Math.PI;
      tube([[4.5+1.25*Math.cos(a),1.2*Math.sin(a),27],[4.6+1.7*Math.cos(a),1.3*Math.sin(a),25.5],[4.7+2.3*Math.cos(a),1.45*Math.sin(a),24.7],[5.1+2.1*Math.cos(a),1.5*Math.sin(a),24.1]],.15,k%2?EDGE:DEEP,7,4);
    }
    // Point-down sword. A thin diamond section catches light on each edge.
    tube([[8.1,1.7,26.3],[8.35,1.9,25.1]],.16,DEEP,8,2);
    tube([[7.7,1.8,25.5],[9,1.8,25.7]],.13,EDGE,8,2);
    const swordBase=[8.45,1.9,25.3],swordTip=[11,3.1,17.6];
    const blade=[plus(swordBase,[-.3,0,0]),plus(swordBase,[0,.11,0]),plus(swordBase,[.3,0,0]),plus(swordBase,[0,-.11,0])];
    for(let j=0;j<4;j++)emit([blade[j],blade[(j+1)%4],swordTip],j%2?EDGE:PATINA);
    // Carved feathers are individual, curved, double-sided solids.
    function feather(root,tip,width,col) {
      const d=minus(tip,root),perp=unit([-d[2],0,d[0]]),rows=contextDetail?2:(siteDetail?4:9),cols=contextDetail?1:(siteDetail?2:4);
      function p(i,j,side){
        const t=i/rows,q=j/cols*2-1,center=lerp(root,tip,t),w=width*Math.pow(Math.sin(Math.PI*t),.72);
        return plus(center,plus(times(perp,w*q),[0,side*.16*(1-q*q)*Math.sin(Math.PI*t)+.4*Math.sin(t*Math.PI),0]));
      }
      for(let side of[-1,1])for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){
        const a=[p(i,j,side),p(i+1,j,side),p(i+1,j+1,side),p(i,j+1,side)];
        emit(side<0?a.reverse():a,col);
      }
      tube([root,plus(lerp(root,tip,.45),[0,.25,0]),tip],t=>.06*Math.sin(Math.PI*t)+.012,EDGE,6,4);
    }
    for(let back of[true,false]){
      const depth=back?-2.9:-.7;
      tube([[3,depth,30.8],[1.7,depth,34.8],[-3.7,depth,37.8],[-10.9,depth,39.7]],t=>.75-.5*t,BRONZE,10,5);
      const outerCount=contextDetail?4:(siteDetail?10:19);
      for(let k=0;k<outerCount;k++){
        const t=k/(outerCount-1);
        feather([2.2-5.2*t,depth,32.5+5*t],[-5-9.8*t,depth-(back?1.5:0),28.7+11.15*t],.49,back?DEEP:(k%3===0?PATINA:BRONZE));
      }
      const innerCount=contextDetail?3:(siteDetail?7:13);
      for(let k=0;k<innerCount;k++){
        const t=k/(innerCount-1);
        feather([2.25-3.3*t,depth+.45,32.7+4.8*t],[-1.5-5*t,depth+.35,31+6*t],.37,k%2?PATINA:BRONZE);
      }
    }
    function giraffe(c,scale,heading=0) {
      giraffes++;
      const ca=Math.cos(heading),sa=Math.sin(heading);
      const at=p=>plus(c,[scale*(p[0]*ca-p[1]*sa),scale*(p[0]*sa+p[1]*ca),scale*p[2]]);
      const limb=(p,r,col=BRONZE)=>tube(p.map(at),t=>scale*r*(.85-.4*t),col,7,3);
      if(contextDetail || siteDetail){
        // At cathedral scale, nine readable long-necked silhouettes are more
        // useful than hundreds of invisible spots, toes and ossicones.
        ellipsoid(at([0,0,2.6]),[1.5*scale,.58*scale,.72*scale],PATINA,6,4);
        for(let x of[-.78,.78])limb([[x,0,2.35],[x*1.08,0,1.15],[x*1.12,0,.13]],.21);
        limb([[.82,0,2.85],[1.22,0,4.65],[1.47,0,6.3]],.42,PATINA);
        ellipsoid(at([1.84,0,6.22]),[.65*scale,.3*scale,.32*scale],EDGE,6,4);
        emit([at([1.45,-.08,6.35]),at([1.1,-.42,6.63]),at([1.52,-.25,6.48])],BRONZE);
        emit([at([1.45,.08,6.35]),at([1.1,.42,6.63]),at([1.52,.25,6.48])],BRONZE);
        limb([[-1.3,0,2.8],[-1.75,.05,2.25],[-1.85,.05,1.55]],.09,DEEP);
        return;
      }
      ellipsoid(at([0,0,2.6]),[1.55*scale,.61*scale,.77*scale],PATINA,12,8);
      for(let x of[-1,1])for(let y of[-.37,.37])limb([[x,y,2.4],[x*1.15,y,1.15],[x*1.24,y+.08,.13]],.23);
      limb([[.85,0,2.9],[1.25,0,4.6],[1.48,0,6.35]],.48,PATINA);
      ellipsoid(at([1.85,0,6.25]),[.68*scale,.32*scale,.34*scale],EDGE,12,7);
      for(let y of[-.28,.28]){
        limb([[1.35,y*.45,6.4],[1.15,y*1.7,6.75]],.15);
        limb([[1.6,y*.7,6.5],[1.6,y*.7,6.96]],.09,DEEP);
      }
      limb([[-1.35,0,2.8],[-1.8,.05,2.35],[-1.9,.05,1.5]],.11,DEEP);
      for(let k=0;k<7;k++){
        const x=-1.05+(k%4)*.65,z=2.55+(k>3?.3:-.15);
        ellipsoid(at([x,.58,z]),[.17*scale,.035*scale,.16*scale],DEEP,7,5);
      }
    }
    // Nine animals, with varied sizes/poses, not nine identical posts.
    giraffe([-3.4,3.5,25.1],1.02,-.12);
    giraffe([3.4,3.1,23.1],.85,.14);
    giraffe([-6.1,1.9,17.6],.73,-.65);
    giraffe([5.3,-3.4,18.4],.67,2.4);
    giraffe([-4.7,-3.8,19.0],.76,1.7);
    giraffe([-2.8,-4,25.2],.62,2.2);
    giraffe([1.2,4.3,16.8],.57,-.25);
    giraffe([6.1,1.8,18.2],.58,.85);
    giraffe([-.8,-5,17.4],.53,2.8);
    // Small paired lion and lamb on the sun side of the sphere. They disappear
    // below a pixel in the cathedral-wide context LOD.
    if(!contextDetail){
      ellipsoid([-6,-2.6,22],[1.65,.68,.7],BRONZE);
      ellipsoid([-4.9,-2.5,22.65],[.63,.64,.67],DEEP);
      ellipsoid([-4.5,-2.65,22.65],[.49,.4,.4],PATINA);
      ellipsoid([-7.1,-3,22.7],[.94,.5,.52],EDGE);
      ellipsoid([-6.25,-3,23],[.33,.28,.36],PATINA);
    }
    // Defeated figure/dragon and suspended head as sculptural motifs, not gore.
    ellipsoid([9.1,2.7,16.5],[1.7,.62,.72],BRONZE);
    tube([[8.6,2.6,16.4],[7.6,2.7,14.8],[8.4,3.5,13.9]],t=>.4-.15*t,BRONZE,8,4);
    tube([[10.2,2.8,16.4],[11.7,3.3,15.2],[11.1,4.6,13.5]],t=>.5-.19*t,BRONZE,8,4);
    tube([[9.7,5.7,19.4],[9.5,6.3,16],[8.5,6.4,13.1]],.11,DEEP,7,5);
    ellipsoid([8.5,6.4,12.5],[.85,.77,1.1],PATINA);
    for(let s of[-1,1])tube([[8.5+s*.5,6.4,13.1],[8.5+s*.9,6.4,13.9],[8.5+s*.65,6.5,14.2]],t=>.19*(1-t)+.025,BRONZE,7,4);
    if(contextDetail){
      // A curled tail and two planar horns keep the tiny context silhouette
      // legible as the vanquished dragon/Satan motif rather than another rock.
      tube([[10.2,2.8,16.4],[12,1.7,15.7],[12.8,2.9,14.6],[11.8,4.1,14]],t=>.34*(1-t)+.08,DEEP,3,1);
      emit([[8.1,6.3,13.25],[7.8,6.35,13.95],[8.45,6.3,13.35]],DEEP);
      emit([[8.9,6.3,13.25],[9.2,6.35,13.95],[8.55,6.3,13.35]],DEEP);
    }

    // Normalize the sculpture's highest point to the published total 40 ft.
    // Scale around the basin contact plane, not world zero: the older version
    // moved the pedestal foot and could visibly sink it into the basin.
    // This is a scale constraint, not a claim that inferred anatomy is measured.
    const contactZ=.94*S,targetTopZ=40*S;
    let maxZ=contactZ;
    sculptureFaces.forEach(f=>f.pts.forEach(p=>{maxZ=Math.max(maxZ,p[2]);}));
    const heightScale=(targetTopZ-contactZ)/Math.max(maxZ-contactZ,1e-9);
    sculptureFaces.forEach(f=>f.pts.forEach(p=>{p[2]=contactZ+(p[2]-contactZ)*heightScale;}));
    return {w:620,h:560,faces,marks:[],lines:[],metadata:{name:'Peace Fountain',artist:'Greg Wyatt',heightFeet:40,giraffes,siteOffsetFeet:options.standalone?[0,0]:[-264,183],sitePosition:'inferred for private review; not survey verified',fidelity:'procedural sculptural study; not a scan',sculptureFaces:sculptureFaces.length,anchor:world([0,0,40])}};
  };
  window.NYC_FORMS.peaceFountain = window.makePeaceFountain;
})();
