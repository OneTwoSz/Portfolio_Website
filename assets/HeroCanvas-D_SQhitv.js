import{P as mt,a as Et,r as nt,u as Tt,p as ft,j as lt}from"./index-DPPeb9eO.js";const pt=14,vt=55*Math.PI/180;function At(t,r){const i=document.querySelector(".stage"),a=i?getComputedStyle(i):null,o=a?parseFloat(a.perspective):NaN,[m,e]=a?a.perspectiveOrigin.split(" ").map(parseFloat):[NaN,NaN];return{focal:mt*(Number.isFinite(o)?o:1100)/Et,shiftX:Number.isFinite(m)?2*m/t-1:0,shiftY:Number.isFinite(e)?1-2*e/r:0}}const Rt=`
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
`,yt=`
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
`,St=.62,ut=48,xt=(t,r,i)=>Math.min(i,Math.max(r,t));function V(t,r,i){const a=xt((i-t)/(r-t),0,1);return a*a*(3-2*a)}function Pt(t,r,i,a,o){const m=o*o,e=m*o,n=[0,0,0];for(let l=0;l<3;l++)n[l]=.5*(2*r[l]+(-t[l]+i[l])*o+(2*t[l]-5*r[l]+4*i[l]-a[l])*m+(-t[l]+3*r[l]-3*i[l]+a[l])*e);return n}function ht(t,r,i){const a=t.createShader(r);if(t.shaderSource(a,i),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS)){const o=t.getShaderInfoLog(a);throw t.deleteShader(a),new Error(`ribbon shader compile failed: ${o}`)}return a}function bt(t){const r=Array.from(t.children);if(!r.length)return null;const i=getComputedStyle(r[0]),a=parseFloat(i.fontSize),o=i.textTransform==="uppercase",m=r.map(n=>(n.textContent??"").trim()),e=m.join(" ");return{font:`${i.fontWeight} {SIZE}px ${i.fontFamily}`,size:a,tracking:(parseFloat(i.letterSpacing)||0)/a,word:o?e.toUpperCase():e,head:o?m[0].toUpperCase():m[0]}}function wt(t,r){const a=t.font.replace("{SIZE}",String(100)),o=document.createElement("canvas").getContext("2d");o.font=a,"letterSpacing"in o&&(o.letterSpacing=`${t.tracking*100}px`);const m=o.measureText(t.word),e=m.fontBoundingBoxAscent,n=m.fontBoundingBoxDescent,l=o.measureText("H").actualBoundingBoxAscent,D=o.measureText(t.head).width,U=.14*100,M=e+n+2*U,S=.42*100,_=.2*100,C=m.width+S+2*_+S,h=Math.min(4096,r),x=h/8,R=document.createElement("canvas");R.width=h,R.height=x;const p=R.getContext("2d");p.fillStyle="#000",p.fillRect(0,0,h,x),p.setTransform(h/C,0,0,x/M,0,0),p.globalCompositeOperation="lighter",p.font=a,"letterSpacing"in p&&(p.letterSpacing=`${t.tracking*100}px`);const I=U+e;p.fillStyle="#f00",p.fillText(t.word,0,I),p.strokeStyle="#0f0",p.lineWidth=.026*100,p.lineJoin="round",p.strokeText(t.word,0,I);const g=m.width+S+_,u=I-l/2,$=_*.28;p.beginPath();for(let s=0;s<8;s++){const v=s%2?$:_,d=s*Math.PI/4-Math.PI/2;p.lineTo(g+Math.cos(d)*v,u+Math.sin(d)*v)}return p.closePath(),p.fillStyle="#00f",p.fill(),{canvas:R,asc:e,desc:n,band:M,tileW:C,headW:D}}function _t(t){const r=document.querySelector(".p-intro h1");if(!r)return null;const i=ht(t,t.VERTEX_SHADER,Rt),a=ht(t,t.FRAGMENT_SHADER,yt),o=t.createProgram();if(t.attachShader(o,i),t.attachShader(o,a),t.linkProgram(o),t.deleteShader(i),t.deleteShader(a),!t.getProgramParameter(o,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(o)??"ribbon link failed");const m=t.getAttribLocation(o,"aPosition"),e=t.getAttribLocation(o,"aData"),n={proj:t.getUniformLocation(o,"uProj"),travel:t.getUniformLocation(o,"uTravel"),tex:t.getUniformLocation(o,"uTex"),color:t.getUniformLocation(o,"uColor"),accent:t.getUniformLocation(o,"uAccent"),head:t.getUniformLocation(o,"uHead"),outlineEnd:t.getUniformLocation(o,"uOutlineEnd"),reveal:t.getUniformLocation(o,"uReveal"),headAlpha:t.getUniformLocation(o,"uHeadAlpha"),headFade:t.getUniformLocation(o,"uHeadFade"),dim:t.getUniformLocation(o,"uDim")},l=t.createBuffer(),D=t.createTexture(),U=t.getExtension("EXT_texture_filter_anisotropic")??t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");let M=0,S=0,_=0,C=null,h=null,x={w:0,h:0},R=!1;const p=()=>{if(C&&(h=wt(C,t.getParameter(t.MAX_TEXTURE_SIZE)),t.bindTexture(t.TEXTURE_2D,D),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGB,t.RGB,t.UNSIGNED_BYTE,h.canvas),t.generateMipmap(t.TEXTURE_2D),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),U)){const s=t.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT);t.texParameterf(t.TEXTURE_2D,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,s))}},I=()=>{const s=r.closest(".panel"),v=r.firstElementChild;if(!s||!v)return null;const{transform:d,display:P}=s.style;s.style.transform="none",s.style.display="";const E=document.createRange();E.selectNodeContents(v);const y=E.getBoundingClientRect();return s.style.transform=d,s.style.display=P,y.height>0?y:null},g=()=>{if(!h||!x.w)return;const s=I();if(!s)return;const{w:v,h:d}=x,P=At(v,d),E=P.focal,y=Math.tan(vt/2),c=2*E*y/d,A=(f,T)=>{const X=2*f/v-1,J=1-2*T/d;return[(X-P.shiftX)*E*y*(v/d),(J-P.shiftY)*E*y]},B=s.height/(h.asc+h.desc)*c,O=h.band*B,z=h.tileW*B,b=h.headW*B,k=pt-E,[W,j]=A(s.left,s.top+s.height/2),N=xt(E*y*(v/d),2,8.5)*.95,F=E*y*.78,L=f=>k-f,H=[[W-b*.5,j,k],[W,j,k],[W+b*.5,j,k],[W+b,j,k],[W+b*1.25,j,k],[Math.max(N*1.25,W+b*1.6),j-F*.2,L(5)],[N*.9,-F*.8,L(9)],[0,-F,L(12.5)],[-N*.85,-F*.55,L(15.5)],[-N*.95,F*.45,L(19.5)],[0,F,L(23.5)],[N*.85,F*.5,L(27.5)],[N*.95,-F*.5,L(31.5)],[N*.2,-F,L(35.5)],[-N*.7,-F*.8,L(39.5)],[-N*1.2,-F*.2,L(43.5)]],w=[];for(let f=1;f<H.length-2;f++)for(let T=0;T<ut;T++)w.push(Pt(H[f-1],H[f],H[f+1],H[f+2],T/ut));w.push(H[H.length-2]);const Y=[0];for(let f=1;f<w.length;f++){const T=w[f-1],X=w[f];Y.push(Y[f-1]+Math.hypot(X[0]-T[0],X[1]-T[1],X[2]-T[2]))}const Z=Y[Y.length-1],et=new Float32Array(w.length*2*6);let q=[0,1],ot=0;for(let f=0;f<w.length;f++){const T=Y[f],X=w[Math.max(0,f-1)],J=w[Math.min(w.length-1,f+1)],rt=J[0]-X[0],it=J[1]-X[1],at=Math.hypot(rt,it);at>1e-4&&(q=[-it/at,rt/at]);const st=1-(1-St)*V(b,b+z*1.2,T),Q=O*st/2;f>0&&(ot+=(T-Y[f-1])/(z*st));const G=w[f],ct=f*12;et.set([G[0]+q[0]*Q,G[1]+q[1]*Q,G[2],ot,0,T/Z],ct),et.set([G[0]-q[0]*Q,G[1]-q[1]*Q,G[2],ot,1,T/Z],ct+6)}t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,et,t.STATIC_DRAW),M=w.length*2,S=b/Z,_=(b+z*.9)/Z},u=document.fonts;return(u?Promise.race([u.load(`900 100px ${getComputedStyle(r).fontFamily}`).then(()=>u.ready),new Promise(s=>window.setTimeout(s,3e3))]):Promise.resolve()).then(()=>{R||(C=bt(r),p(),g())}),{resize(s,v){x={w:s,h:v},g()},draw(s,v){const d=v/mt,P=M>0;if(r.style.opacity=P?(1-V(.05,.13,d)).toFixed(3):"",!P)return;const E=V(0,.05,d);if(E<=0)return;const y=S+(1.05-S)*(1-Math.pow(1-V(.04,1.4,d),2)),c=Math.sin((d%1+1)%1*Math.PI),A=1-V(.35,.8,d)*(1-(.3+.7*c));t.useProgram(o),t.bindBuffer(t.ARRAY_BUFFER,l),t.enableVertexAttribArray(m),t.vertexAttribPointer(m,3,t.FLOAT,!1,24,0),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,3,t.FLOAT,!1,24,12),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,D),t.uniform1i(n.tex,0),t.uniformMatrix4fv(n.proj,!1,s),t.uniform1f(n.travel,v),t.uniform3f(n.color,.957,.949,.941),t.uniform3f(n.accent,1,.365,.18),t.uniform1f(n.head,S),t.uniform1f(n.outlineEnd,_),t.uniform1f(n.reveal,y),t.uniform1f(n.headAlpha,E),t.uniform1f(n.headFade,1-V(.2,.55,d)),t.uniform1f(n.dim,A),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA),t.drawArrays(t.TRIANGLE_STRIP,0,M),t.disableVertexAttribArray(m),t.disableVertexAttribArray(e)},dispose(){R=!0,r.style.opacity="",t.deleteBuffer(l),t.deleteTexture(D),t.deleteProgram(o)}}}const Ft=`
  precision highp float;

  attribute vec3 aPosition;
  attribute float aScale;

  uniform mat4 uProj;
  uniform float uTime;
  uniform float uTravel;
  uniform float uRoll;
  uniform vec2 uPointer;
  uniform float uSize;
  /** Smoothed flight speed, 0 at rest → 1 flat out. Purely radial, never sideways. */
  uniform float uRush;

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

    // Pointer parallax, strongest on the points nearest the camera. Kept
    // small: it is a hint of depth, not something to steer.
    p.xy += uPointer * 0.55 * (0.35 + (p.z + LEN) * 0.02);

    // --- rush ---------------------------------------------------------------
    // At speed the field opens outward from the axis, most on the near
    // points, which reads as the corridor streaming past you. It is radial
    // only — nothing moves sideways, so there is nothing to look shaky.
    float depth01 = (p.z + LEN) / LEN;
    p.xy *= 1.0 + uRush * 0.12 * depth01;

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
    gl_PointSize = uSize * aScale * (100.0 / dist) * (1.0 + uRush * 0.25);

    // Fade in at the far end and back out just before the camera, so points
    // arrive and leave rather than popping.
    float far = smoothstep(LEN + 14.0, LEN - 16.0, dist);
    float near = smoothstep(14.0, 27.0, dist);
    // A little brighter at speed, which also warms the brightest points
    // toward the accent, since the fragment shader mixes on vFade.
    vFade = far * near * (0.35 + n * 0.65) * (1.0 + uRush * 0.3);
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
`,tt=9e3;function dt(t,r,i){const a=t.createShader(r);if(t.shaderSource(a,i),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS)){const o=t.getShaderInfoLog(a);throw t.deleteShader(a),new Error(`shader compile failed: ${o}`)}return a}function Ut(t,r,i,a,o){const m=1/Math.tan(r/2),e=1/(a-o);return t.fill(0),t[0]=m/i,t[5]=m,t[10]=(o+a)*e,t[11]=-1,t[14]=2*o*a*e,t}const K=(t,r,i,a)=>t+(r-t)*(1-Math.exp(-i*a));function gt({travel:t}){const r=nt.useRef(null),i=nt.useRef(null),a=Tt();return nt.useEffect(()=>{const o=i.current,m=r.current;if(!o||!m)return;const e=o.getContext("webgl2",{antialias:!1,alpha:!0,premultipliedAlpha:!1})??o.getContext("webgl",{antialias:!1,alpha:!0,premultipliedAlpha:!1});if(!e)return;let n;try{const c=dt(e,e.VERTEX_SHADER,Ft),A=dt(e,e.FRAGMENT_SHADER,Lt);if(n=e.createProgram(),e.attachShader(n,c),e.attachShader(n,A),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(n)??"link failed");e.deleteShader(c),e.deleteShader(A)}catch(c){console.warn("[hero] WebGL unavailable:",c);return}e.useProgram(n);const l=new Float32Array(tt*3),D=new Float32Array(tt);for(let c=0;c<tt;c++)l[c*3+0]=(Math.random()-.5)*46,l[c*3+1]=(Math.random()-.5)*26,l[c*3+2]=-Math.random()*78,D[c]=.35+Math.random()*1.15;const U=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,U),e.bufferData(e.ARRAY_BUFFER,l,e.STATIC_DRAW);const M=e.getAttribLocation(n,"aPosition"),S=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,S),e.bufferData(e.ARRAY_BUFFER,D,e.STATIC_DRAW);const _=e.getAttribLocation(n,"aScale"),C=()=>{e.useProgram(n),e.bindBuffer(e.ARRAY_BUFFER,U),e.enableVertexAttribArray(M),e.vertexAttribPointer(M,3,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,S),e.enableVertexAttribArray(_),e.vertexAttribPointer(_,1,e.FLOAT,!1,0,0)};let h=null;if(!ft())try{h=_t(e)}catch(c){console.warn("[hero] ribbon unavailable:",c)}e.useProgram(n);const x={proj:e.getUniformLocation(n,"uProj"),time:e.getUniformLocation(n,"uTime"),travel:e.getUniformLocation(n,"uTravel"),roll:e.getUniformLocation(n,"uRoll"),rush:e.getUniformLocation(n,"uRush"),pointer:e.getUniformLocation(n,"uPointer"),size:e.getUniformLocation(n,"uSize"),opacity:e.getUniformLocation(n,"uOpacity"),color:e.getUniformLocation(n,"uColor"),accent:e.getUniformLocation(n,"uAccent")};e.uniform3f(x.color,.957,.949,.941),e.uniform3f(x.accent,1,.365,.18),e.disable(e.DEPTH_TEST),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE);const R=new Float32Array(16),p=()=>{const c=Math.max(1,o.clientWidth||window.innerWidth),A=Math.max(1,o.clientHeight||window.innerHeight),B=Math.min(window.devicePixelRatio||1,1.75),O=Math.max(1,Math.floor(c*B)),z=Math.max(1,Math.floor(A*B));(o.width!==O||o.height!==z)&&(o.width=O,o.height=z),e.viewport(0,0,O,z),Ut(R,vt,c/A,.1,120);const b=At(c,A);R[8]=-b.shiftX,R[9]=-b.shiftY,e.useProgram(n),e.uniformMatrix4fv(x.proj,!1,R),h==null||h.resize(c,A)};p();const I=new ResizeObserver(p);I.observe(o);const g=ft(),u={opacity:0,travel:t.current,px:0,py:0,time:0,rush:0};let $=t.current,s=performance.now(),v=0,d=!0;const P=c=>{if(!d)return;const A=Math.min((c-s)/1e3,.05);s=c,g||(u.time+=A),u.opacity=K(u.opacity,.78,1.4,A),u.travel=K(u.travel,t.current,5,A),u.px=K(u.px,g?0:a.current.x,1.5,A),u.py=K(u.py,g?0:-a.current.y,1.5,A);const B=Math.abs(t.current-$)/Math.max(A,.001);$=t.current;const O=g?0:Math.min(B/18,1);u.rush=K(u.rush,O,O>u.rush?2.2:1.4,A),C(),e.blendFunc(e.SRC_ALPHA,e.ONE),e.uniform1f(x.time,u.time),e.uniform1f(x.travel,u.travel),e.uniform1f(x.rush,u.rush),e.uniform1f(x.roll,Math.sin(u.time*.05)*.04),e.uniform2f(x.pointer,u.px,u.py),e.uniform1f(x.size,window.innerWidth<720?1.7:2.4),e.uniform1f(x.opacity,u.opacity),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.POINTS,0,tt),e.disableVertexAttribArray(M),e.disableVertexAttribArray(_),h==null||h.draw(R,t.current),v=requestAnimationFrame(P)};v=requestAnimationFrame(P);const E=()=>{document.hidden?(d=!1,cancelAnimationFrame(v)):d||(d=!0,s=performance.now(),v=requestAnimationFrame(P))};document.addEventListener("visibilitychange",E);const y=c=>{c.preventDefault(),d=!1,cancelAnimationFrame(v)};return o.addEventListener("webglcontextlost",y),()=>{d=!1,cancelAnimationFrame(v),I.disconnect(),document.removeEventListener("visibilitychange",E),o.removeEventListener("webglcontextlost",y),h==null||h.dispose(),e.deleteBuffer(U),e.deleteBuffer(S),e.deleteProgram(n)}},[t,a]),lt.jsx("div",{className:"hero-canvas",ref:r,"aria-hidden":"true",children:lt.jsx("canvas",{ref:i})})}export{gt as default};
