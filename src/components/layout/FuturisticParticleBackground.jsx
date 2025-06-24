import React, { useRef, useEffect } from 'react';

const FuturisticParticleBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    let particlesArray = [];
    const numberOfParticles = Math.floor(canvas.width / 20);
    class Particle {
      constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
      }
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
        this.x += this.speedX;
        this.y += this.speedY;
      }
      draw() {
        ctx.fillStyle = 'rgba(217, 119, 6, 0.3)';
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.4 - 0.2;
        const speedY = Math.random() * 0.4 - 0.2;
        particlesArray.push(new Particle(x, y, size, speedX, speedY));
      }
    }
    function connect() {
      if (!ctx) return;
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
          
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000); 
            ctx.strokeStyle = `rgba(168, 178, 209, ${opacityValue})`; 
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    }
    init();
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); 

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default FuturisticParticleBackground;
