const PREFIXES = ['webkit', 'Moz', 'ms', 'O'];
const ANITRANS = 'all 0.6s cubic-bezier(.23,1,.32,1)';
const SETTRANS = 'all 0s';
let SAVEPOS;
let DIRECTION;


export function createEl(tag, prop) {
    var el = document.createElement(tag || 'div');
    css(el, prop);
    return el;
}

function css(el, prop) {
    for (var n in prop) el.style[vendor(el, n)||n] = prop[n];
}

function vendor(el, prop) {
    var s = el.style, pp, i;
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(i=0; i<PREFIXES.length; i++) {
        pp = PREFIXES[i]+prop;
        if(s[pp] !== undefined) return pp;
    }
    if(s[prop] !== undefined) return prop;
}

function checkDerection(e, pos, sizeQ) {
    var fx = pos.x, fy = pos.y, tx = e.pageX - fx, ty = e.pageY - fy, direction;
    if (tx < sizeQ) direction = 0; // left
    else if (tx > sizeQ * 3) direction = 1; // right
    else if (ty < sizeQ) direction = 2; // top
    else direction = 3; // bottom
    return direction;
}

function checkPos(e, pos, size) {
    var fx = pos.x, fy = pos.y, tx = e.pageX - fx, ty = e.pageY - fy, value,
        a = size - tx, b = size - ty, c = tx >> 1, d = ty >> 1, e = a >> 1, f = b >> 1;
    if (DIRECTION == 0) value = {bx:-size, by:0, sx:-1, sy:1, bs:'shadowL', bmx:-size + tx, bmy:0, bsw:tx, bsh:size, bsx:a, bsy:0, cw:size - c, ch:size, cx:c, cy:0, dw:c, dh:size, dx:c - (c >> 1), dy:0}; // left
    else if (DIRECTION == 1) value = {bx:size, by:0, sx:-1, sy:1, bs:'shadowR', bmx:tx, bmy:0, bsw:a, bsh:size, bsx:0, bsy:0, cw:size - e, ch:size, cx:0, cy:0, dw:e, dh:size, dx:size - a + (e >> 1), dy:0}; // right
    else if (DIRECTION == 2) value = {bx:0, by:-size, sx:1, sy:-1, bs:'shadowT', bmx:0, bmy:-size + ty, bsw:size, bsh:ty, bsx:0, bsy:b, cw:size, ch:size - d, cx:0, cy:d, dw:size, dh:d, dx:0, dy:d - (d >> 1)}; // top
    else value = {bx:0, by:size, sx:1, sy:-1, bs:'shadowB', bmx:0, bmy:ty, bsw:size, bsh:b, bsx:0, bsy:0, cw:size, ch:size - f, cx:0, cy:0, dw:size, dh:f, dx:0, dy:size - b + (f >> 1)}; // bottom
    return value;
}

export function onEnter(e, value) {
    var cpos = value.container.getBoundingClientRect(),
        mpos = {x:cpos.left + window.pageXOffset, y:cpos.top + window.pageYOffset};
    DIRECTION = checkDerection(e, mpos, value.sizeQ);
    SAVEPOS = checkPos(e, mpos, value.size);
    SAVEPOS.pos = mpos;
    var bx = SAVEPOS.bx, by = SAVEPOS.by, sx = SAVEPOS.sx, sy = SAVEPOS.sy, bs = SAVEPOS.bs;
    value.backShadow.className = value.depth.className = 'sticker-shadow ' + bs;
    css(value.mask, {
        transition: SETTRANS,
        width: value.size + 'px',
        height: value.size + 'px',
        transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
    });
    css(value.move, {
        transition: SETTRANS,
        transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
    });
    css(value.back, {
        transition: SETTRANS,
        transform: 'translate(' + bx + 'px, ' + by + 'px)'
    });
    css(value.backImg, {
        transform: 'scaleX(' + sx + ') scaleY(' + sy + ')'
    });
    css(value.depth, {
        transform: 'translate(' + -10000 + 'px, ' + -10000 + 'px)'
    });
}

export function onLeave(e, value) {
    if (SAVEPOS == null) return;
    var bx = SAVEPOS.bx, by = SAVEPOS.by;
    css(value.mask, {
        transition: ANITRANS,
        width: value.size + 'px',
        height: value.size + 'px',
        transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
    });
    css(value.move, {
        transition: ANITRANS,
        transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
    });
    css(value.back, {
        transition: ANITRANS,
        transform: 'translate(' + bx + 'px, ' + by + 'px)'
    });
    css(value.depth, {
        transform: 'translate(' + -10000 + 'px, ' + -10000 + 'px)'
    });
    SAVEPOS = null;
}

export function onMove(e, value) {
    if (SAVEPOS == null) {
        onEnter(e, value);
        window.document.addEventListener('mouseup', function (e) {
            this.removeEventListener('mouseup', arguments.callee, false);
            onLeave(e, value);
        }, false);
    }
    var pos = checkPos(e, SAVEPOS.pos, value.size),
        bmx = pos.bmx, bmy = pos.bmy,
        bsw = pos.bsw, bsh = pos.bsh, bsx = pos.bsx, bsy = pos.bsy,
        cw = pos.cw, ch = pos.ch, cx = pos.cx, cy = pos.cy,
        dw = pos.dw, dh = pos.dh, dx = pos.dx, dy = pos.dy;
    css(value.mask, {
        width: cw + 'px',
        height: ch + 'px',
        transform: 'translate(' + cx + 'px, ' + cy + 'px)'
    });
    css(value.move, {
        transform: 'translate(' + -cx + 'px, ' + -cy + 'px)'
    });
    css(value.back, {
        transform: 'translate(' + bmx + 'px, ' + bmy + 'px)'
    });
    css(value.backShadow, {
        width: bsw + 'px',
        height: bsh + 'px',
        transform: 'translate(' + bsx + 'px, ' + bsy + 'px)'
    });
    css(value.depth, {
        width: dw + 'px',
        height: dh + 'px',
        transform: 'translate(' + dx + 'px, ' + dy + 'px)'
    });
}