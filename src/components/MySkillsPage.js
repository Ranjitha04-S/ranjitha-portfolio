import React, { useEffect, useRef, useState } from "react";
import {
  HTMLIcon, CSSIcon, JavaScriptIcon, ReactIcon,
  NodeIcon, ExpressIcon, MongoDBIcon, MySQLIcon,
  TypeScriptIcon, GitIcon, PostmanIcon, TailwindIcon, JavaIcon
} from "./SkillsIcons";

import LogoComponent from "../subComponents/LogoComponent";
import SocialIcons from "../subComponents/SocialIcons";
import BigTitle from "../subComponents/BigTitlte";

import { DarkTheme } from './Themes'
import ParticleComponent from '../subComponents/ParticleComponent'
import PowerButton from "../subComponents/PowerButton";

const skills = [
  { name: "HTML",         color: "#E34F26", Icon: HTMLIcon        },
  { name: "CSS",          color: "#1572B6", Icon: CSSIcon         },
  { name: "JavaScript",   color: "#F7DF1E", Icon: JavaScriptIcon  },
  { name: "React",        color: "#61DAFB", Icon: ReactIcon       },
  { name: "Node.js",      color: "#339933", Icon: NodeIcon        },
  { name: "Express",      color: "#aaaaaa", Icon: ExpressIcon     },
  { name: "MongoDB",      color: "#47A248", Icon: MongoDBIcon     },
  { name: "MySQL",        color: "#4479A1", Icon: MySQLIcon       },
  { name: "TypeScript",   color: "#3178C6", Icon: TypeScriptIcon  },
  { name: "Git",          color: "#F05032", Icon: GitIcon         },
  { name: "Tailwind CSS", color: "#2496ED", Icon: TailwindIcon    },
  { name: "Postman",      color: "#FF6C37", Icon: PostmanIcon     },
];

// Only applies on mobile — desktop (>=769) always returns 1 (no scaling)
const getMobileScale = () => {
  if (typeof window === 'undefined') return 1;
  const w = window.innerWidth;
  if (w >= 769) return 1;
  if (w >= 601) return 500 / 680;
  if (w >= 481) return 400 / 680;
  if (w >= 381) return 340 / 680;
  return 300 / 680;
};

const MySkillsPage = () => {
  const canvasRef      = useRef(null);
  const animationRef   = useRef(null);
  const edgePositions  = useRef([]);
  const phaseRef       = useRef('radials');

  const [showIcons,   setShowIcons]   = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [centerScale, setCenterScale] = useState(0);
  const [scale,       setScale]       = useState(getMobileScale());

  useEffect(() => {
    const handleResize = () => setScale(getMobileScale());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Canvas loop — always 680px, untouched from original ──────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const SIZE   = 680;
    canvas.width = canvas.height = SIZE;

    const cfg = {
      cx:         SIZE / 2,
      cy:         SIZE / 2,
      numRadials: 12,
      numSpirals: 10,
      maxRadius:  300,
      stroke:     DarkTheme.text,
    };

    const radials = Array.from({ length: cfg.numRadials }, (_, i) => {
      const angle = (Math.PI * 2 * i) / cfg.numRadials - Math.PI / 2;
      return {
        angle,
        ex: cfg.cx + Math.cos(angle) * cfg.maxRadius,
        ey: cfg.cy + Math.sin(angle) * cfg.maxRadius,
      };
    });

    const spirals = Array.from({ length: cfg.numSpirals }, (_, i) => ({
      progress: 0,
      points: Array.from({ length: cfg.numRadials + 1 }, (_, j) => {
        const angle = (Math.PI * 2 * j) / cfg.numRadials - Math.PI / 2;
        const r     = (cfg.maxRadius * (i + 1)) / cfg.numSpirals;
        return { x: cfg.cx + Math.cos(angle) * r, y: cfg.cy + Math.sin(angle) * r };
      }),
    }));

    edgePositions.current = radials.map(r => ({ x: r.ex, y: r.ey }));

    let radialProgress = 0;
    let spiralIndex    = 0;
    let time           = 0;

    const glow = (n) => { ctx.shadowBlur = n; ctx.shadowColor = cfg.stroke; };

    const drawRadials = (progress, wave) => {
      radials.forEach((l, i) => {
        const p  = Math.min(progress, 1);
        const wx = wave ? -Math.sin(l.angle) * Math.sin(time + i * 0.5) * 2 : 0;
        const wy = wave ?  Math.cos(l.angle) * Math.sin(time + i * 0.5) * 2 : 0;
        ctx.beginPath();
        ctx.moveTo(cfg.cx, cfg.cy);
        ctx.lineTo(cfg.cx + (l.ex - cfg.cx) * p + wx, cfg.cy + (l.ey - cfg.cy) * p + wy);
        ctx.strokeStyle = cfg.stroke;
        ctx.lineWidth   = 1.5;
        glow(12); ctx.stroke(); glow(0);
      });
    };

    const drawSpirals = () => {
      spirals.forEach((spiral, idx) => {
        if (idx > spiralIndex) return;
        const prog = idx < spiralIndex ? 1 : spiral.progress;
        const n    = Math.floor(spiral.points.length * prog);
        if (n < 2) return;
        ctx.beginPath();
        ctx.moveTo(spiral.points[0].x, spiral.points[0].y);
        for (let i = 1; i < n; i++) ctx.lineTo(spiral.points[i].x, spiral.points[i].y);
        ctx.strokeStyle = cfg.stroke;
        ctx.lineWidth   = 1;
        glow(6); ctx.stroke(); glow(0);
        if (prog < 1) {
          const pt = spiral.points[n - 1];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = cfg.stroke;
          glow(15); ctx.fill(); glow(0);
        }
      });
    };

    const drawCenter = () => {
      const g = ctx.createRadialGradient(cfg.cx, cfg.cy, 0, cfg.cx, cfg.cy, 10);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cfg.cx, cfg.cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      time += 0.04;

      const phase = phaseRef.current;

      if (phase === 'radials') {
        radialProgress = Math.min(radialProgress + 0.025, 1);
        drawRadials(radialProgress, false);
        drawCenter();
        if (radialProgress >= 1) {
          phaseRef.current = 'icons';
          setShowIcons(true);
        }
      } else if (phase === 'icons') {
        drawRadials(1, false);
        drawCenter();
      } else if (phase === 'spirals') {
        drawRadials(1, false);
        if (spiralIndex < cfg.numSpirals) {
          spirals[spiralIndex].progress += 0.022;
          if (spirals[spiralIndex].progress >= 1) {
            spirals[spiralIndex].progress = 1;
            spiralIndex++;
          }
        } else {
          phaseRef.current = 'idle';
        }
        drawSpirals();
        drawCenter();
      } else if (phase === 'idle') {
        drawRadials(1, true);
        drawSpirals();
        drawCenter();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    if (!showIcons) return;
    let opacity = 0;
    let rafId;
    const fadeIn = () => {
      opacity = Math.min(opacity + 0.025, 1);
      setLogoOpacity(opacity);
      setCenterScale(opacity);
      if (opacity < 1) {
        rafId = requestAnimationFrame(fadeIn);
      } else {
        setTimeout(() => { phaseRef.current = 'spirals'; }, 500);
      }
    };
    rafId = requestAnimationFrame(fadeIn);
    return () => cancelAnimationFrame(rafId);
  }, [showIcons]);

  return (
    <div style={{
      minHeight:      "100vh",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      background:     DarkTheme.body,
      fontFamily:     DarkTheme.fontFamily,
      position:       "relative",
      overflow:       "visible",
    }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleComponent theme="dark" />
      </div>

      <PowerButton />
      <LogoComponent theme="dark" />
      <SocialIcons theme="dark" />

      <BigTitle text="SKILLS" top="5rem" left="5rem" />

      {/*
        The inner div is always 680×680 — identical to original.
        On mobile only, CSS transform scale() shrinks the whole thing uniformly.
        Desktop gets scale(1) = zero effect.
      */}
      <div style={{
        position:        "relative",
        width:           680,
        height:          680,
        zIndex:          10,
        transform:       `scale(${scale})`,
        transformOrigin: "center center",
      }}>
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />

        {/* Icons — 100% identical to original */}
        {showIcons && edgePositions.current.map((pos, i) => {
          const skill = skills[i];
          if (!skill) return null;
          const S = 64;
          return (
            <div key={i} style={{
              position:       "absolute",
              left:           pos.x - S / 2,
              top:            pos.y - S / 2,
              width:          S,
              height:         S,
              borderRadius:   "50%",
              background:     DarkTheme.body,
              border:         `2px solid ${skill.color}`,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              boxShadow:      `0 0 20px ${skill.color}55`,
              opacity:        logoOpacity,
              transform:      `scale(${logoOpacity > 0 ? 1 : 0})`,
              transition:     `opacity 0.4s ease ${i * 0.06}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s`,
              zIndex:         10,
              overflow:       "hidden",
              padding:        "6px 4px 10px",
            }}>
              <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <skill.Icon width={32} height={32} fill={skill.color} />
              </div>
              <span style={{
                fontSize:      "7px",
                color:         "rgba(255,255,255,0.75)",
                letterSpacing: "0.04em",
                textAlign:     "center",
                lineHeight:    1,
                fontWeight:    800,
                whiteSpace:    "nowrap",
              }}>{skill.name}</span>
            </div>
          );
        })}

        {/* Center Java — 100% identical to original */}
        {showIcons && (
          <div style={{
            position:       "absolute",
            left:           340 - 40,
            top:            340 - 40,
            width:          80,
            height:         80,
            borderRadius:   "50%",
            background:     `radial-gradient(circle, ${DarkTheme.body} 60%, #000 100%)`,
            border:         `2.5px solid ${DarkTheme.text}`,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            boxShadow:      `0 0 35px ${DarkTheme.text}77`,
            opacity:        centerScale,
            transform:      `scale(${centerScale > 0 ? 1 : 0})`,
            transition:     "opacity 0.5s ease 0.3s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s",
            zIndex:         20,
            gap:            2,
          }}>
            <JavaIcon width={32} height={32} />
            <span style={{ fontSize: "8px", color: DarkTheme.text, fontWeight: "700", letterSpacing: "0.1em" }}>
              JAVA
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySkillsPage;