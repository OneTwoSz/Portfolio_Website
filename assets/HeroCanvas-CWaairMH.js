import{P as rt,a as Et,r as nt,u as wt,p as lt,j as dt}from"./index-DIo8q-jR.js";const pt=14,vt=55*Math.PI/180;function xt(t,r){const c=document.querySelector(".stage"),a=c?getComputedStyle(c):null,o=a?parseFloat(a.perspective):NaN,[u,e]=a?a.perspectiveOrigin.split(" ").map(parseFloat):[NaN,NaN];return{focal:rt*(Number.isFinite(o)?o:1100)/Et,shiftX:Number.isFinite(u)?2*u/t-1:0,shiftY:Number.isFinite(e)?1-2*e/r:0}}const Tt=`
  precision highp float;

  attribute vec3 aPosition;
  /** u along the text, v across it, and s: 0 at the head, 1 at the tail. */
  attribute vec3 aData;

  uniform mat4 uProj;
  uniform float uTravel;

  varying vec2 vUv;
  varying float vS;
  varying float vDist;

  void main() {
    vec3 p = aPosition;
    p.z += uTravel;
    vec4 mv = vec4(p.xy, p.z - ${pt.toFixed(1)}, 1.0);
    vDist = -mv.z;
    vUv = aData.xy;
    vS = aData.z;
    gl_Position = uProj * mv;
  }
`,Rt=`
  precision mediump float;

  // r: solid text, g: outlined text, b: the accent star
  uniform sampler2D uTex;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uHead;        // s where the hero's first word ends
  uniform float uOutlineEnd;  // s by which the solid fill has become outline
  uniform float uReveal;      // s of the unspooling front
  uniform float uHeadAlpha;
  uniform float uHeadFade;    // the solid head, fading as it rushes past the camera
  uniform float uDim;

  varying vec2 vUv;
  varying float vS;
  varying float vDist;

  void main() {
    // Slight negative bias: at the handoff the head is shown near 1:1 and has
    // to match crisp DOM text, which plain trilinear filtering softens.
    vec3 m = texture2D(uTex, vUv, -0.4).rgb;

    float k = smoothstep(uHead, uOutlineEnd, vS);
    float textA = mix(m.r, m.g, k);
    float a = max(textA, m.b);
    if (a < 0.004) discard;
    vec3 col = mix(uColor, uAccent, m.b / a);

    float front = 1.0 - smoothstep(uReveal - 0.025, uReveal, vS);
    float gate = uHeadAlpha * (vS < uHead ? 1.0 : front);
    float tail = 1.0 - smoothstep(0.6, 0.95, vS);
    // The head stays full strength so it matches the DOM title it replaces;
    // everything after it is scenery and steps back while a panel is parked.
    float body = mix(uHeadFade, 0.72 * uDim, k);
    // Gone before it can fill the lens, and faded in from the far end.
    float depth = smoothstep(1.2, 4.5, vDist) * smoothstep(85.0, 55.0, vDist);

    gl_FragColor = vec4(col, a * gate * tail * body * depth);
  }
`,St=.62,ht=48,At=(t,r,c)=>Math.min(c,Math.max(r,t));function $(t,r,c){const a=At((c-t)/(r-t),0,1);return a*a*(3-2*a)}function yt(t,r,c,a,o){const u=o*o,e=u*o,n=[0,0,0];for(let d=0;d<3;d++)n[d]=.5*(2*r[d]+(-t[d]+c[d])*o+(2*t[d]-5*r[d]+4*c[d]-a[d])*u+(-t[d]+3*r[d]-3*c[d]+a[d])*e);return n}function ut(t,r,c){const a=t.createShader(r);if(t.shaderSource(a,c),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS)){const o=t.getShaderInfoLog(a);throw t.deleteShader(a),new Error(`ribbon shader compile failed: ${o}`)}return a}function Pt(t){const r=Array.from(t.children);if(!r.length)return null;const c=getComputedStyle(r[0]),a=parseFloat(c.fontSize),o=c.textTransform==="uppercase",u=r.map(n=>(n.textContent??"").trim()),e=u.join(" ");return{font:`${c.fontWeight} {SIZE}px ${c.fontFamily}`,size:a,tracking:(parseFloat(c.letterSpacing)||0)/a,word:o?e.toUpperCase():e,head:o?u[0].toUpperCase():u[0]}}function bt(t,r){const a=t.font.replace("{SIZE}",String(100)),o=document.createElement("canvas").getContext("2d");o.font=a,"letterSpacing"in o&&(o.letterSpacing=`${t.tracking*100}px`);const u=o.measureText(t.word),e=u.fontBoundingBoxAscent,n=u.fontBoundingBoxDescent,d=o.measureText("H").actualBoundingBoxAscent,N=o.measureText(t.head).width,L=.14*100,M=e+n+2*L,R=.42*100,P=.2*100,C=u.width+R+2*P+R,h=Math.min(4096,r),A=h/8,T=document.createElement("canvas");T.width=h,T.height=A;const m=T.getContext("2d");m.fillStyle="#000",m.fillRect(0,0,h,A),m.setTransform(h/C,0,0,A/M,0,0),m.globalCompositeOperation="lighter",m.font=a,"letterSpacing"in m&&(m.letterSpacing=`${t.tracking*100}px`);const B=L+e;m.fillStyle="#f00",m.fillText(t.word,0,B),m.strokeStyle="#0f0",m.lineWidth=.026*100,m.lineJoin="round",m.strokeText(t.word,0,B);const U=u.width+R+P,f=B-d/2,k=P*.28;m.beginPath();for(let s=0;s<8;s++){const p=s%2?k:P,v=s*Math.PI/4-Math.PI/2;m.lineTo(U+Math.cos(v)*p,f+Math.sin(v)*p)}return m.closePath(),m.fillStyle="#00f",m.fill(),{canvas:T,asc:e,desc:n,band:M,tileW:C,headW:N}}function _t(t){const r=document.querySelector(".p-intro h1");if(!r)return null;const c=ut(t,t.VERTEX_SHADER,Tt),a=ut(t,t.FRAGMENT_SHADER,Rt),o=t.createProgram();if(t.attachShader(o,c),t.attachShader(o,a),t.linkProgram(o),t.deleteShader(c),t.deleteShader(a),!t.getProgramParameter(o,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(o)??"ribbon link failed");const u=t.getAttribLocation(o,"aPosition"),e=t.getAttribLocation(o,"aData"),n={proj:t.getUniformLocation(o,"uProj"),travel:t.getUniformLocation(o,"uTravel"),tex:t.getUniformLocation(o,"uTex"),color:t.getUniformLocation(o,"uColor"),accent:t.getUniformLocation(o,"uAccent"),head:t.getUniformLocation(o,"uHead"),outlineEnd:t.getUniformLocation(o,"uOutlineEnd"),reveal:t.getUniformLocation(o,"uReveal"),headAlpha:t.getUniformLocation(o,"uHeadAlpha"),headFade:t.getUniformLocation(o,"uHeadFade"),dim:t.getUniformLocation(o,"uDim")},d=t.createBuffer(),N=t.createTexture(),L=t.getExtension("EXT_texture_filter_anisotropic")??t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");let M=0,R=0,P=0,C=null,h=null,A={w:0,h:0},T=!1;const m=()=>{if(C&&(h=bt(C,t.getParameter(t.MAX_TEXTURE_SIZE)),t.bindTexture(t.TEXTURE_2D,N),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGB,t.RGB,t.UNSIGNED_BYTE,h.canvas),t.generateMipmap(t.TEXTURE_2D),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),L)){const s=t.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT);t.texParameterf(t.TEXTURE_2D,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,s))}},B=()=>{const s=r.closest(".panel"),p=r.firstElementChild;if(!s||!p)return null;const{transform:v,display:b}=s.style;s.style.transform="none",s.style.display="";const E=document.createRange();E.selectNodeContents(p);const i=E.getBoundingClientRect();return s.style.transform=v,s.style.display=b,i.height>0?i:null},U=()=>{if(!h||!A.w)return;const s=B();if(!s)return;const{w:p,h:v}=A,b=xt(p,v),E=b.focal,i=Math.tan(vt/2),x=2*E*i/v,I=(l,w)=>{const X=2*l/p-1,J=1-2*w/v;return[(X-b.shiftX)*E*i*(p/v),(J-b.shiftY)*E*i]},g=s.height/(h.asc+h.desc)*x,z=h.band*g,O=h.tileW*g,S=h.headW*g,W=pt-E,[j,Y]=I(s.left,s.top+s.height/2),D=At(E*i*(p/v),2,8.5)*.95,_=E*i*.78,F=l=>W-l,H=[[j-S*.5,Y,W],[j,Y,W],[j+S*.5,Y,W],[j+S,Y,W],[j+S*1.25,Y,W],[Math.max(D*1.25,j+S*1.6),Y-_*.2,F(5)],[D*.9,-_*.8,F(9)],[0,-_,F(12.5)],[-D*.85,-_*.55,F(15.5)],[-D*.95,_*.45,F(19.5)],[0,_,F(23.5)],[D*.85,_*.5,F(27.5)],[D*.95,-_*.5,F(31.5)],[D*.2,-_,F(35.5)],[-D*.7,-_*.8,F(39.5)],[-D*1.2,-_*.2,F(43.5)]],y=[];for(let l=1;l<H.length-2;l++)for(let w=0;w<ht;w++)y.push(yt(H[l-1],H[l],H[l+1],H[l+2],w/ht));y.push(H[H.length-2]);const G=[0];for(let l=1;l<y.length;l++){const w=y[l-1],X=y[l];G.push(G[l-1]+Math.hypot(X[0]-w[0],X[1]-w[1],X[2]-w[2]))}const K=G[G.length-1],et=new Float32Array(y.length*2*6);let q=[0,1],ot=0;for(let l=0;l<y.length;l++){const w=G[l],X=y[Math.max(0,l-1)],J=y[Math.min(y.length-1,l+1)],it=J[0]-X[0],st=J[1]-X[1],at=Math.hypot(it,st);at>1e-4&&(q=[-st/at,it/at]);const ct=1-(1-St)*$(S,S+O*1.2,w),Q=z*ct/2;l>0&&(ot+=(w-G[l-1])/(O*ct));const V=y[l],ft=l*12;et.set([V[0]+q[0]*Q,V[1]+q[1]*Q,V[2],ot,0,w/K],ft),et.set([V[0]-q[0]*Q,V[1]-q[1]*Q,V[2],ot,1,w/K],ft+6)}t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,et,t.STATIC_DRAW),M=y.length*2,R=S/K,P=(S+O*.9)/K},f=document.fonts;return(f?Promise.race([f.load(`900 100px ${getComputedStyle(r).fontFamily}`).then(()=>f.ready),new Promise(s=>window.setTimeout(s,3e3))]):Promise.resolve()).then(()=>{T||(C=Pt(r),m(),U())}),{resize(s,p){A={w:s,h:p},U()},draw(s,p){const v=p/rt,b=M>0;if(r.style.opacity=b?(1-$(.05,.13,v)).toFixed(3):"",!b)return;const E=$(0,.05,v);if(E<=0)return;const i=R+(1.05-R)*(1-Math.pow(1-$(.04,1.4,v),2)),x=Math.sin((v%1+1)%1*Math.PI),I=1-$(.35,.8,v)*(1-(.3+.7*x));t.useProgram(o),t.bindBuffer(t.ARRAY_BUFFER,d),t.enableVertexAttribArray(u),t.vertexAttribPointer(u,3,t.FLOAT,!1,24,0),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,3,t.FLOAT,!1,24,12),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,N),t.uniform1i(n.tex,0),t.uniformMatrix4fv(n.proj,!1,s),t.uniform1f(n.travel,p),t.uniform3f(n.color,.957,.949,.941),t.uniform3f(n.accent,1,.365,.18),t.uniform1f(n.head,R),t.uniform1f(n.outlineEnd,P),t.uniform1f(n.reveal,i),t.uniform1f(n.headAlpha,E),t.uniform1f(n.headFade,1-$(.2,.55,v)),t.uniform1f(n.dim,I),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA),t.drawArrays(t.TRIANGLE_STRIP,0,M),t.disableVertexAttribArray(u),t.disableVertexAttribArray(e)},dispose(){T=!0,r.style.opacity="",t.deleteBuffer(d),t.deleteTexture(N),t.deleteProgram(o)}}}const Ft=`
  precision highp float;

  attribute vec3 aPosition;
  attribute float aScale;

  uniform mat4 uProj;
  uniform float uTime;
  uniform float uTravel;
  uniform float uRoll;
  uniform vec2 uPointer;
  uniform float uSize;
  /** 0 when parked on a panel, →1 crossing between two. Drives the vortex. */
  uniform float uSwirl;

  varying float vFade;

  // Length of the corridor. Points that pass the camera wrap back to the far
  // end, so the field is effectively infinite in the direction of travel.
  const float LEN = 78.0;

  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(dot(hash3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
              dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
          mix(dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
              dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
      mix(mix(dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
              dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
          mix(dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
              dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y),
      u.z);
  }

  void main() {
    vec3 p = aPosition;

    // Noise is sampled from the point's home position, so its drift travels
    // with it and the wrap seam never shows.
    float t = uTime * 0.08;
    float n = noise(p * 0.28 + vec3(0.0, 0.0, t));
    float n2 = noise(p * 0.55 + vec3(t * 1.4, 0.0, 0.0));

    p.x += n2 * 0.65;
    p.y += n * 0.5;

    // Scroll flies the camera forward: every point marches toward it and
    // recycles to the far end of the corridor on the way past.
    p.z = mod(p.z + uTravel, LEN) - LEN;

    // pointer parallax, strongest on the points nearest the camera
    p.xy += uPointer * 1.35 * (0.35 + (p.z + LEN) * 0.02);

    // --- vortex -----------------------------------------------------------
    // Crossing between panels twists the field around the view axis. The
    // rotation falls off with radius, so points near the centre whip around
    // while the outer field barely moves — that shear is what reads as a
    // vortex rather than a flat spin. Depth is folded in too, so the twist
    // corkscrews down the corridor instead of turning as one rigid sheet.
    float radius = length(p.xy);
    float depth01 = (p.z + LEN) / LEN;
    float twist = uSwirl * (2.6 / (radius * 0.28 + 1.0)) * (0.45 + depth01 * 0.9);

    float tc = cos(twist);
    float ts = sin(twist);
    p.xy = vec2(p.x * tc - p.y * ts, p.x * ts + p.y * tc);

    // Pull inward as it spins, so the field funnels toward the axis and
    // springs back open once you settle on a panel.
    p.xy *= 1.0 - uSwirl * 0.22;

    // a very slow roll so the field never looks locked to the viewport
    float c = cos(uRoll);
    float s = sin(uRoll);
    p.xy = vec2(p.x * c - p.y * s, p.x * s + p.y * c);

    // camera sits at z = 14 looking down -z
    vec4 mv = vec4(p.x, p.y, p.z - 14.0, 1.0);
    float dist = -mv.z;

    gl_Position = uProj * mv;
    // Inverse-distance sizing across a 78-unit corridor: points arrive as
    // specks and swell as they pass, which is what sells the forward motion.
    // The vortex fattens them slightly so the twist has some weight.
    gl_PointSize = uSize * aScale * (100.0 / dist) * (1.0 + uSwirl * 0.45);

    // Fade in at the far end and back out just before the camera, so points
    // arrive and leave rather than popping.
    float far = smoothstep(LEN + 14.0, LEN - 16.0, dist);
    float near = smoothstep(14.0, 27.0, dist);
    // Brightening during the swirl also warms the field toward the accent,
    // since the fragment shader mixes on vFade.
    vFade = far * near * (0.35 + n * 0.65) * (1.0 + uSwirl * 0.5);
  }
`,Lt=`
  precision mediump float;

  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float alpha = smoothstep(0.25, 0.0, d) * vFade * uOpacity;
    vec3 col = mix(uColor, uAccent, smoothstep(0.55, 1.0, vFade));
    gl_FragColor = vec4(col, alpha);
  }
`,tt=9e3;function mt(t,r,c){const a=t.createShader(r);if(t.shaderSource(a,c),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS)){const o=t.getShaderInfoLog(a);throw t.deleteShader(a),new Error(`shader compile failed: ${o}`)}return a}function Mt(t,r,c,a,o){const u=1/Math.tan(r/2),e=1/(a-o);return t.fill(0),t[0]=u/c,t[5]=u,t[10]=(o+a)*e,t[11]=-1,t[14]=2*o*a*e,t}const Z=(t,r,c,a)=>t+(r-t)*(1-Math.exp(-c*a));function gt({travel:t}){const r=nt.useRef(null),c=nt.useRef(null),a=wt();return nt.useEffect(()=>{const o=c.current,u=r.current;if(!o||!u)return;const e=o.getContext("webgl2",{antialias:!1,alpha:!0,premultipliedAlpha:!1})??o.getContext("webgl",{antialias:!1,alpha:!0,premultipliedAlpha:!1});if(!e)return;let n;try{const i=mt(e,e.VERTEX_SHADER,Ft),x=mt(e,e.FRAGMENT_SHADER,Lt);if(n=e.createProgram(),e.attachShader(n,i),e.attachShader(n,x),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(n)??"link failed");e.deleteShader(i),e.deleteShader(x)}catch(i){console.warn("[hero] WebGL unavailable:",i);return}e.useProgram(n);const d=new Float32Array(tt*3),N=new Float32Array(tt);for(let i=0;i<tt;i++)d[i*3+0]=(Math.random()-.5)*46,d[i*3+1]=(Math.random()-.5)*26,d[i*3+2]=-Math.random()*78,N[i]=.35+Math.random()*1.15;const L=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,L),e.bufferData(e.ARRAY_BUFFER,d,e.STATIC_DRAW);const M=e.getAttribLocation(n,"aPosition"),R=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,R),e.bufferData(e.ARRAY_BUFFER,N,e.STATIC_DRAW);const P=e.getAttribLocation(n,"aScale"),C=()=>{e.useProgram(n),e.bindBuffer(e.ARRAY_BUFFER,L),e.enableVertexAttribArray(M),e.vertexAttribPointer(M,3,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,R),e.enableVertexAttribArray(P),e.vertexAttribPointer(P,1,e.FLOAT,!1,0,0)};let h=null;if(!lt())try{h=_t(e)}catch(i){console.warn("[hero] ribbon unavailable:",i)}e.useProgram(n);const A={proj:e.getUniformLocation(n,"uProj"),time:e.getUniformLocation(n,"uTime"),travel:e.getUniformLocation(n,"uTravel"),roll:e.getUniformLocation(n,"uRoll"),swirl:e.getUniformLocation(n,"uSwirl"),pointer:e.getUniformLocation(n,"uPointer"),size:e.getUniformLocation(n,"uSize"),opacity:e.getUniformLocation(n,"uOpacity"),color:e.getUniformLocation(n,"uColor"),accent:e.getUniformLocation(n,"uAccent")};e.uniform3f(A.color,.957,.949,.941),e.uniform3f(A.accent,1,.365,.18),e.disable(e.DEPTH_TEST),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE);const T=new Float32Array(16),m=()=>{const i=Math.max(1,o.clientWidth||window.innerWidth),x=Math.max(1,o.clientHeight||window.innerHeight),I=Math.min(window.devicePixelRatio||1,1.75),g=Math.max(1,Math.floor(i*I)),z=Math.max(1,Math.floor(x*I));(o.width!==g||o.height!==z)&&(o.width=g,o.height=z),e.viewport(0,0,g,z),Mt(T,vt,i/x,.1,120);const O=xt(i,x);T[8]=-O.shiftX,T[9]=-O.shiftY,e.useProgram(n),e.uniformMatrix4fv(A.proj,!1,T),h==null||h.resize(i,x)};m();const B=new ResizeObserver(m);B.observe(o);const U=lt(),f={opacity:0,travel:t.current,px:0,py:0,time:0,swirl:0};let k=performance.now(),s=0,p=!0;const v=i=>{if(!p)return;const x=Math.min((i-k)/1e3,.05);k=i,U||(f.time+=x),f.opacity=Z(f.opacity,.78,1.4,x);const I=f.travel;f.travel=Z(f.travel,t.current,6,x),f.px=Z(f.px,U?0:a.current.x,2.5,x),f.py=Z(f.py,U?0:-a.current.y,2.5,x);const g=t.current/rt,z=Math.sin(Math.abs(g%1)*Math.PI),O=Math.min(Math.abs(f.travel-I)/Math.max(x,1e-4)/14,1),S=U?0:z*O;f.swirl=Z(f.swirl,S,S>f.swirl?7:3.5,x),C(),e.blendFunc(e.SRC_ALPHA,e.ONE),e.uniform1f(A.time,f.time),e.uniform1f(A.travel,f.travel),e.uniform1f(A.swirl,f.swirl),e.uniform1f(A.roll,Math.sin(f.time*.05)*.04),e.uniform2f(A.pointer,f.px,f.py),e.uniform1f(A.size,window.innerWidth<720?1.7:2.4),e.uniform1f(A.opacity,f.opacity),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.POINTS,0,tt),e.disableVertexAttribArray(M),e.disableVertexAttribArray(P),h==null||h.draw(T,t.current),s=requestAnimationFrame(v)};s=requestAnimationFrame(v);const b=()=>{document.hidden?(p=!1,cancelAnimationFrame(s)):p||(p=!0,k=performance.now(),s=requestAnimationFrame(v))};document.addEventListener("visibilitychange",b);const E=i=>{i.preventDefault(),p=!1,cancelAnimationFrame(s)};return o.addEventListener("webglcontextlost",E),()=>{p=!1,cancelAnimationFrame(s),B.disconnect(),document.removeEventListener("visibilitychange",b),o.removeEventListener("webglcontextlost",E),h==null||h.dispose(),e.deleteBuffer(L),e.deleteBuffer(R),e.deleteProgram(n)}},[t,a]),dt.jsx("div",{className:"hero-canvas",ref:r,"aria-hidden":"true",children:dt.jsx("canvas",{ref:c})})}export{gt as default};
