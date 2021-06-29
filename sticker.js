import { createEl, onEnter, onLeave, onMove } from "./utils.js";

export class Sticker {
    value;

    constructor(dom) {
        this.pos = dom.getBoundingClientRect();
        this.size = this.pos.width;
        this.sizeQ = this.size >> 2;

        const container = createEl('div', {
            position: 'relative',
            width: this.size + 'px',
            height: this.size + 'px',
            overflow: 'hidden'
        });
        const mask = createEl('div', {
            position: 'relative',
            width: this.size + 'px',
            height: this.size + 'px',
            overflow: 'hidden'
        });
        const move = createEl('div', {
            position: 'relative',
            borderRadius: '50%',
            width: this.size + 'px',
            height: this.size + 'px',
            overflow: 'hidden'
        });
        const front = createEl('div', {
            position: 'relative',
            borderRadius: '50%',
            width: this.size + 'px',
            height: this.size + 'px',
            zIndex: 1
        });
        const back = createEl('div', {
            position: 'absolute',
            borderRadius: '50%',
            width: this.size + 'px',
            height: this.size + 'px',
            left: '0',
            top: '0',
            zIndex: 3,
            backgroundColor: '#ffffff',
            transform: 'translate(' + this.size + 'px, ' + 0 + 'px)',
            overflow: 'hidden'
        });
        const backImg = createEl('div', {
            position: 'relative',
            borderRadius: '50%',
            width: this.size + 'px',
            height: this.size + 'px',
            opacity: '0.4'
        });
        const backShadow = createEl('div', {
            position: 'absolute',
            width: this.size + 'px',
            height: this.size + 'px',
            left: '0',
            top: '0',
            zIndex: 4
        });
        const depth = createEl('div', {
            position: 'absolute',
            width: this.size + 'px',
            height: this.size + 'px',
            left: '0',
            top: '0',
            zIndex: 1
        });


        front.className = 'sticker-img sticker-front';
        backImg.className = 'sticker-img sticker-back';
        backShadow.className = depth.className = 'sticker-shadow';
        dom.appendChild(container);
        container.appendChild(mask);
        mask.appendChild(move);
        move.appendChild(front);
        move.appendChild(depth);
        move.appendChild(back);
        back.appendChild(backImg);
        back.appendChild(backShadow);
        
        const value = {
            container: container, 
            size: this.size, 
            sizeQ: this.sizeQ, 
            mask: mask, 
            move: move, 
            depth: depth, 
            back: back, 
            backImg: backImg, 
            backShadow: backShadow
        };

        dom.addEventListener('mouseenter', function(e) {
            onEnter(e, value);
        }, false);
        dom.addEventListener('mouseleave', function(e) {
            onLeave(e, value);
        }, false);
        dom.addEventListener('mousemove', function(e) {
            onMove(e, value);
        }, false);
    }
}