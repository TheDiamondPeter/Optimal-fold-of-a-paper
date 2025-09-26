(function () {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    const inpL = document.getElementById('inpL');
    const inpW = document.getElementById('inpW');
    //const inpX = document.getElementById('inpX');
    //const fromTop = document.getElementById('fromTop');
    //const sliderA = document.getElementById('sliderA');
    const sliderX = document.getElementById('sliderX');

    const caValue = document.getElementById('CA');
    const avalSpan = document.getElementById('aval');
    const areaSpan = document.getElementById('area');
    const aoptSpan = document.getElementById('aopt');
    const maxareaSpan = document.getElementById('maxarea');
    const xaSpan = document.getElementById('xa');

    const setXOpt = document.getElementById('setXOpt');

    function parseNum(el, fallback = 0) {
        const v = parseFloat(el.value);
        return Number.isFinite(v) ? v : fallback;
    }

    let curOptimalX = 0;

    function draw() {
        // read inputs
        const W = Math.max(10, parseNum(inpL, 360));
        const H = Math.max(10, parseNum(inpW, 200));
        const x = Math.max(0, Math.min(H, parseNum(sliderX)));

        // clamp slider max to W
        sliderX.max = Math.ceil(H*0.5);

        // analytic optimum
        const a = Math.sqrt(Math.pow((H - x), 2) - Math.pow(x, 2));
        const area_current = 0.5 * a * x;
        const area_opt = (Math.pow(H, 2)) / (6 * Math.sqrt(3)) //(W*W) / (6 * Math.sqrt(3));
        const xa_opt = H / 3 //Math.sqrt(W * W + x * x);
        const a_opt = Math.sqrt(Math.pow((H - xa_opt), 2) - Math.pow(xa_opt, 2));

        curOptimalX = xa_opt;

        //caValue.textContent = a.toFixed(2);
        avalSpan.textContent = x.toFixed(1);
        areaSpan.textContent = area_current.toFixed(2);
        aoptSpan.textContent = a.toFixed(2);
        maxareaSpan.textContent = area_opt.toFixed(2);
        xaSpan.textContent = xa_opt.toFixed(2);

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // compute scale and offsets to center drawing
        const margin = 20;
        const scale = Math.min((canvas.width - 2 * margin) / (W || 1), (canvas.height - 2 * margin) / (H || 1));
        const ox = margin + 10;
        const oy = canvas.height - margin; // place C at (ox, oy)

        // helper to map rect coords (x,y) to canvas coords
        function Xcx(x) {
            return ox + x * scale;
        }
        function Ycx(y) {
            return oy - y * scale;
        }

        // draw rectangle C(0,0),D(W,0),B(W,H),A0(0,H)
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#444";
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.rect(Xcx(0), Ycx(H), W * scale, H * scale);
        ctx.stroke();

        // label corners
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
        ctx.fillText("A", Xcx(0) - 12, Ycx(H) - 6);
        ctx.fillText("B", Xcx(W) + 4, Ycx(H) - 6);
        ctx.fillText("C", Xcx(0) - 12, Ycx(0) + 14);
        ctx.fillText("D", Xcx(W) + 4, Ycx(0) + 14);

        // draw X at left edge (0,x)
        const Xx = Xcx(0), Xy = Ycx(x);
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(Xx, Xy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("X", Xx - 18, Xy + 4);

        // draw point A = (a,0)
        const Ax = Xcx(a), Ay = Ycx(0);
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(Ax, Ay, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("A", Ax - 6, Ay + 16);

        // draw triangle X-C-A (fill translucent)
        ctx.fillStyle = "rgba(70,130,230,0.35)";
        ctx.beginPath();
        ctx.moveTo(Xx, Xy); // X
        ctx.lineTo(Xcx(0), Ycx(0)); // C
        ctx.lineTo(Ax, Ay); // A
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(70,130,230,0.8)";
        ctx.stroke();

        // indicate optimal A
        const Xy_opt = Ycx(xa_opt);
        const AoptX = Xcx(a_opt), AoptY = Ycx(0);
        ctx.strokeStyle = "#ff5c5c";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Xx, Xy_opt);
        ctx.lineTo(AoptX, AoptY);
        ctx.stroke();
        ctx.fillStyle = "#ff5c5c";
        ctx.beginPath();
        ctx.arc(AoptX, AoptY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.fillText("A\u2099 (opt)", AoptX - 38, AoptY + 16);

        // draw line from X to top-right B to show the alternative lines in the sample image
        ctx.strokeStyle = "#666";
        ctx.beginPath();
        ctx.moveTo(Xx, Xy);
        ctx.lineTo(Xcx(W), Ycx(H));
        ctx.stroke();

        // small legend
        ctx.fillStyle = "#000";
        ctx.font = "12px sans-serif";
        ctx.fillText("Blue = triangle X-C-A (current)", 535, 14);
        ctx.fillStyle = "#ff5c5c";
        ctx.fillText("Red dot & line = optimal AX", 540, 30);
    }

    // wire events
    [inpL, inpW, sliderX].forEach(e => e.addEventListener('input', draw));
    // initialize slider max based on defaults
    sliderX.max = parseNum(inpL, 360);
    draw();

    setXOpt.addEventListener('click', function () {
        sliderX.value = curOptimalX;
        draw();
    })
})();