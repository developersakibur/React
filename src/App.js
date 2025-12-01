import React, { useState, useEffect, useRef } from 'react';

export default function CosmicParticleMagic() {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [mode, setMode] = useState('sparkle');
  const animationRef = useRef(null);

  const modes = {
    sparkle: { color: '#ffd700', emoji: '✨', name: 'Stardust' },
    lightning: { color: '#00ffff', emoji: '⚡', name: 'Lightning' },
    wind: { color: '#98fb98', emoji: '💨', name: 'Wind' },
    water: { color: '#4169e1', emoji: '💧', name: 'Water' }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      createParticles(e.clientX, e.clientY);
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const handleClick = (e) => {
      for (let i = 0; i < 50; i++) {
        createParticles(e.clientX, e.clientY);
      }
    };
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [mode]);

  const createParticles = (x, y) => {
    setParticles(prev => {
      const newParticles = [...prev];
      
      for (let i = 0; i < 3; i++) {
        const particle = {
          x,
          y,
          vx: (Math.random() - 0.5) * (mode === 'lightning' ? 10 : mode === 'wind' ? 6 : 4),
          vy: (Math.random() - 0.5) * (mode === 'lightning' ? 10 : mode === 'water' ? -8 : 4),
          life: 1,
          size: Math.random() * (mode === 'sparkle' ? 4 : 3) + 1,
          color: modes[mode].color,
          mode
        };
        newParticles.push(particle);
      }
      
      return newParticles.slice(-500);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles(prev => {
        return prev.map(p => {
          const updated = { ...p };
          updated.x += updated.vx;
          updated.y += updated.vy;
          
          if (updated.mode === 'water') {
            updated.vy += 0.3;
          } else if (updated.mode === 'wind') {
            updated.vx += 0.1;
          } else if (updated.mode === 'lightning') {
            updated.vx *= 0.95;
            updated.vy *= 0.95;
          }
          
          updated.life -= 0.01;
          return updated;
        }).filter(p => {
          if (p.life <= 0) return false;

          ctx.save();
          ctx.globalAlpha = p.life;
          
          if (p.mode === 'sparkle') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
          } else if (p.mode === 'lightning') {
            ctx.shadowBlur = 20;
            ctx.shadowColor = p.color;
          }
          
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
          return true;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #1e1b4b 100%)',
    overflow: 'hidden',
    margin: 0,
    padding: 0
  };

  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    cursor: 'crosshair'
  };

  const headerStyle = {
    position: 'absolute',
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10
  };

  const cardStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
    textAlign: 'center',
    background: 'linear-gradient(to right, #fef08a, #fbcfe8, #e9d5ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px'
  };

  const getButtonStyle = (isActive, color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '12px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: isActive ? 'white' : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? '#1e1b4b' : 'white',
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isActive ? `0 0 20px ${color}` : 'none'
  });

  const footerStyle = {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10
  };

  const counterStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    padding: '12px 24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontFamily: 'monospace'
  };

  return (
    <div style={containerStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      
      <div style={headerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>
            ✨ Cosmic Particle Magic ✨
          </h1>
          <p style={subtitleStyle}>Move your mouse • Click for explosion</p>
          
          <div style={buttonContainerStyle}>
            {Object.entries(modes).map(([key, { emoji, name, color }]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={getButtonStyle(mode === key, color)}
              >
                <span style={{ fontSize: '20px' }}>{emoji}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={counterStyle}>
          Particles: <span style={{ color: '#fde047', fontWeight: 'bold' }}>{particles.length}</span>
        </div>
      </div>
    </div>
  );
}