import React, { useEffect, useRef, useState } from "react";
import styled, { ThemeProvider, keyframes, createGlobalStyle } from "styled-components";
import { DarkTheme } from "./Themes";
import { motion, AnimatePresence } from "framer-motion";

import LogoComponent from "../subComponents/LogoComponent";
import SocialIcons from "../subComponents/SocialIcons";
import PowerButton from "../subComponents/PowerButton";
import BigTitle from "../subComponents/BigTitlte";
import { Projects } from "../data/ProjectsData";
import { YinYang } from "./AllSvgs";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: #ACC7B4; border-radius: 3px; box-shadow: 0 0 8px #ACC7B4; }
`;

const gridMove    = keyframes` from { background-position: 0 0; } to { background-position: 60px 60px; } `;
const pageScan    = keyframes` from { transform: translateY(-100%); } to { transform: translateY(100vh); } `;
const particleDrift = keyframes`
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.8; }
  100% { transform: translateY(-105vh) translateX(30px); opacity: 0; }
`;
const twinkle = keyframes`
  0%, 100% { opacity: 0.2; box-shadow: 0 0 4px #fff; }
  50%       { opacity: 1;   box-shadow: 0 0 14px #fff, 0 0 28px rgba(255,255,255,0.4); }
`;
const titleReveal = keyframes`
  from { opacity: 0; letter-spacing: 0.5em; filter: blur(10px); }
  to   { opacity: 1; letter-spacing: 0.08em; filter: blur(0); }
`;
const glowLineAnim = keyframes`
  0%,100% { box-shadow: 0 0 6px #ACC7B440; }
  50%     { box-shadow: 0 0 18px #ACC7B490; }
`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Box = styled.div`
  background-color: ${p => p.theme.body};
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  &::before {
    content:''; position:fixed; inset:0;
    background-image: linear-gradient(rgba(172,199,180,0.04) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(172,199,180,0.04) 1px,transparent 1px);
    background-size:60px 60px;
    animation:${gridMove} 10s linear infinite;
    pointer-events:none; z-index:0;
  }
  &::after {
    content:''; position:fixed; left:0; top:0; width:100%; height:160px;
    background:linear-gradient(transparent,rgba(172,199,180,0.025),transparent);
    animation:${pageScan} 9s linear infinite;
    pointer-events:none; z-index:1;
  }
`;

const Vignette = styled.div`
  position:fixed; inset:0;
  background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.88) 100%);
  pointer-events:none; z-index:2;
`;

const Particle = styled.div`
  position:fixed; bottom:-10px; left:${p => p.$left}%;
  width:${p => p.$size}px; height:${p => p.$size}px;
  border-radius:50%;
  background:${p => p.$color};
  animation:
    ${particleDrift} ${p => p.$dur}s linear infinite,
    ${twinkle} ${p => p.$twinkDur}s ease-in-out infinite;
  animation-delay:${p => p.$delay}s, ${p => p.$delay * 0.5}s;
  pointer-events:none; z-index:3;
`;

const COLORS = ['#ffffff', '#e8e0ff', '#c4b5fd', '#a78bfa', '#d4e4ff'];
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  dur: Math.random() * 12 + 8,
  twinkDur: Math.random() * 3 + 2,
  delay: -(Math.random() * 20),
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
}));

/* ─── Layout ─── */

const ProjectList = styled(motion.div)`
  position: relative; z-index: 10;
  max-width: 1300px; width: 100%;
  margin: 0 auto;
  /* push content below fixed header items */
  padding: 8rem 8rem 6rem;

  @media (max-width: 1024px) { padding: 7rem 4rem 5rem; }
  @media (max-width: 768px)  { padding: 6.5rem 2rem 4rem; }
  @media (max-width: 480px)  { padding: 6rem 1rem 3.5rem; }
`;

/* ─── Rows ─── */

const ProjectRow = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.4rem 0;
  border-bottom: 1px solid rgba(172,199,180,0.1);
  cursor: pointer;
  transition: border-color .3s ease, background .3s ease;
  &:first-child { border-top: 1px solid rgba(172,199,180,0.1); }
  &:hover { border-bottom-color: rgba(172,199,180,0.32); background: rgba(172,199,180,0.02); }

  /* stack on small phones */
  @media (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
    gap: .5rem;
    padding: 1.4rem 0;
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2.5rem;
  flex: 1;
  min-width: 0;               /* prevent overflow */

  @media (max-width: 768px) { gap: 1.2rem; }
  @media (max-width: 540px) { flex-direction: column; gap: .3rem; }
`;

const RowNum = styled.span`
  font-family: 'Courier New', monospace;
  font-size: clamp(.65rem, 1vw, .75rem);
  color: #ACC7B438;
  letter-spacing: .1em;
  min-width: 2.5rem;
  flex-shrink: 0;
  transition: color .3s ease;
  ${ProjectRow}:hover & { color: #ACC7B4; }

  @media (max-width: 540px) { min-width: auto; }
`;

const RowTitle = styled.h2`
  font-family: 'Courier New', monospace;
  font-size: clamp(1rem, 2.5vw, 1.9rem);
  font-weight: 700;
  color: #ACC7B4;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: text-shadow .3s ease;
  ${ProjectRow}:hover & { text-shadow: 0 0 22px #ACC7B460, 0 0 55px #ACC7B430; }

  @media (max-width: 480px) {
    font-size: clamp(.9rem, 4.5vw, 1.15rem);
    white-space: normal;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  margin-top: .5rem;
`;

const RowTag = styled.span`
  font-family: 'Courier New', monospace;
  font-size: .65rem;
  letter-spacing: .06em;
  color: #ACC7B450;
  text-transform: uppercase;
  border: 1px solid #ACC7B428;
  padding: 3px 10px;
  clip-path: polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);
  transition: all .3s ease;
  ${ProjectRow}:hover & { color: #ACC7B4; border-color: #ACC7B460; box-shadow: 0 0 8px #ACC7B428; }

  @media (max-width: 480px) { font-size: .58rem; padding: 2px 8px; }
`;

const TimeStamp = styled.span`
  font-family: 'Courier New', monospace;
  font-size: clamp(.6rem, 1vw, .72rem);
  letter-spacing: .15em;
  text-transform: uppercase;
  color: #ACC7B438;
  white-space: nowrap;
  flex-shrink: 0;
  padding: .5rem .8rem;
  transition: color .3s ease;
  ${ProjectRow}:hover & { color: #ACC7B4; }

  @media (max-width: 540px) {
    padding: .2rem 0;
    font-size: .58rem;
    align-self: flex-end;
  }
`;

/* ─── Cursor Preview (desktop only) ─── */

const CursorPreview = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 999;
  width: 300px;
  transform: translate(24px,-50%);

  @media (max-width: 768px) { display: none; }
`;

const PreviewCard = styled.div`
  background: rgba(4,10,6,.97);
  border: 1px solid #ACC7B440;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 30px #ACC7B428, 0 0 60px #ACC7B418, 0 20px 60px rgba(0,0,0,.85);
`;

const PreviewMedia = styled.div`
  width: 100%; aspect-ratio: 16/9; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: #060e08;
  video, img { width:100%; height:100%; object-fit:cover; }
`;

const PreviewPlaceholder = styled.div`
  width:100%; height:100%;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.6rem;
  background:linear-gradient(135deg,#0a160d,#050d07);
  span:first-child { font-size:2.8rem; }
  span:last-child  { font-family:'Courier New',monospace; font-size:.58rem; letter-spacing:.2em; color:#ACC7B440; text-transform:uppercase; }
`;

const PreviewFooter = styled.div`
  padding:.7rem 1rem; display:flex; align-items:center; justify-content:space-between;
  span { font-family:'Courier New',monospace; font-size:.6rem; letter-spacing:.12em; color:#ACC7B460; text-transform:uppercase; }
  div  { width:6px; height:6px; border-radius:50%; background:#ACC7B4; box-shadow:0 0 8px #ACC7B4; }
`;

/* ─── Modal ─── */

const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0;
  background: rgba(0,0,0,.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;

  @media (max-width: 600px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalCard = styled(motion.div)`
  background: linear-gradient(150deg,rgba(8,18,11,.99),rgba(3,8,5,1));
  border: 1px solid #ACC7B440;
  border-radius: 20px;
  width: 100%; max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 0 50px #ACC7B428, 0 0 100px #ACC7B415, 0 30px 80px rgba(0,0,0,.9);
  position: relative;

  /* styled scrollbar inside modal */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #ACC7B440; border-radius: 2px; }

  @media (max-width: 600px) {
    border-radius: 20px 20px 0 0;
    max-height: 88vh;
    width: 100%;
  }
`;

const ModalClose = styled.button`
  position: absolute; top: 1.2rem; right: 1.2rem;
  width: 38px; height: 38px;
  background: #ACC7B415;
  border: 1px solid #ACC7B440;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: #ACC7B4;
  z-index: 10;
  transition: all .3s ease;
  &:hover { background: #ACC7B430; box-shadow: 0 0 16px #ACC7B440; }

  @media (max-width: 480px) {
    width: 32px; height: 32px; font-size: .85rem;
    top: .8rem; right: .8rem;
  }
`;

const ModalMedia = styled.div`
  width: 100%; aspect-ratio: 16/7;
  background: #060e08;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  position: relative;
  display: flex; align-items: center; justify-content: center;
  video, img { width:100%; height:100%; object-fit:cover; }

  @media (max-width: 600px) { aspect-ratio: 16/8; }
  @media (max-width: 400px) { aspect-ratio: 16/10; }
`;

const ModalMediaEmpty = styled.div`
  width:100%; height:100%;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem;
  background:linear-gradient(135deg,#0a160d,#050d07);
  span:first-child { font-size:4rem; }
  span:last-child  { font-family:'Courier New',monospace; font-size:.7rem; letter-spacing:.2em; color:#ACC7B440; text-transform:uppercase; }

  @media (max-width: 480px) {
    span:first-child { font-size: 2.8rem; }
    span:last-child  { font-size: .58rem; }
  }
`;

const Scanlines = styled.div`
  position:absolute; inset:0; pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(172,199,180,0.015) 2px,rgba(172,199,180,0.015) 4px);
`;

const ModalBody = styled.div`
  padding: 1.4rem 1.8rem 1.8rem;

  @media (max-width: 600px) { padding: 1rem 1.2rem 1.5rem; }
  @media (max-width: 400px) { padding: .8rem 1rem 1.2rem; }
`;

const ModalMeta = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: .8rem; margin-bottom: .8rem; flex-wrap: wrap;
`;

const ModalTitle = styled.h2`
  font-family: 'Courier New', monospace;
  font-size: clamp(1.05rem, 2.5vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #ACC7B4;
  text-shadow: 0 0 22px #ACC7B460;
  line-height: 1.2;
`;

const ModalYear = styled.span`
  font-family: 'Courier New', monospace;
  font-size: .68rem;
  letter-spacing: .2em;
  color: #ACC7B450;
  text-transform: uppercase;
  border: 1px solid #ACC7B330;
  padding: 4px 12px;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: .3rem;

  @media (max-width: 400px) { font-size: .58rem; padding: 3px 8px; }
`;

const ModalDivider = styled.div`
  width: 100%; height: 1px;
  background: linear-gradient(90deg,#ACC7B450,#ACC7B420,transparent);
  margin: .7rem 0;
  box-shadow: 0 0 8px #ACC7B428;
`;

const ModalDesc = styled.p`
  font-family: 'Courier New', monospace;
  font-size: clamp(.82rem, 1.4vw, .98rem);
  line-height: 1.75;
  color: rgba(172,199,180,0.85);
  letter-spacing: .02em;
  margin-bottom: 1rem;
`;

const SectionLabel = styled.p`
  font-family: 'Courier New', monospace;
  font-size: .68rem;
  letter-spacing: .28em;
  color: #ACC7B4;
  text-transform: uppercase;
  margin-bottom: .55rem;
`;

const TechGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: .45rem; margin-bottom: 1.2rem;
`;

const TechTag = styled.span`
  font-family: 'Courier New', monospace;
  font-size: .78rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #000;
  background: #ACC7B4;
  padding: 5px 16px;
  clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  font-weight: 700;
  box-shadow: 0 0 12px #ACC7B450;

  @media (max-width: 400px) { font-size: .68rem; padding: 4px 12px; }
`;

const LinkRow = styled.div`
  display: flex; gap: 1rem; flex-wrap: wrap;

  @media (max-width: 480px) { flex-direction: column; gap: .7rem; }
`;

const ModalLink = styled.a`
  display: inline-flex; align-items: center; gap: .5rem;
  font-family: 'Courier New', monospace;
  font-size: .78rem;
  letter-spacing: .15em;
  text-transform: uppercase;
  text-decoration: none;
  padding: .6rem 1.4rem;
  border: 1px solid ${p => p.$primary ? '#ACC7B4' : '#ACC7B440'};
  color: ${p => p.$primary ? '#000' : '#ACC7B4'};
  background: ${p => p.$primary ? '#ACC7B4' : 'transparent'};
  clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
  transition: all .3s ease;
  box-shadow: ${p => p.$primary ? '0 0 20px #ACC7B460' : 'none'};
  &:hover {
    background: ${p => p.$primary ? '#c8ddd1' : '#ACC7B418'};
    box-shadow: 0 0 28px #ACC7B460;
    color: ${p => p.$primary ? '#000' : '#ACC7B4'};
  }
  @media (max-width: 480px) { justify-content: center; }
`;

/* ─── YinYang spinner ─── */

const Rotate = styled.span`
  display: block;
  position: fixed; right: 1.5rem; bottom: 1.5rem;
  width: 80px; height: 80px;
  z-index: 50;

  @media (max-width: 768px) { width: 60px; height: 60px; right: 1rem; bottom: 1rem; }
  @media (max-width: 480px) { width: 44px; height: 44px; right: .7rem; bottom: .7rem; }
`;

/* ─── BigTitle — hide on mobile so it doesn't overlap rows ─── */

const BigTitleWrap = styled.div`
  @media (max-width: 768px) { display: none; }
`;

/* ─── Motion variants ─── */

const listVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: .1, delayChildren: .3 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -28 },
  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 16 } },
};

const GLYPHS = ["◈", "◇", "⬡", "⬟", "◉", "⟁", "⬢", "◆", "▲", "●"];

/* ─── Component ─── */

const ProjectPage = () => {
  const yinyang = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const onMove = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const rotate = () => {
      if (yinyang.current)
        yinyang.current.style.transform = `rotate(${-window.pageYOffset}deg)`;
    };
    window.addEventListener("scroll", rotate);
    return () => window.removeEventListener("scroll", rotate);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject]);

  const hoveredProject = Projects.find(w => w.id === hoveredId);

  return (
    <ThemeProvider theme={DarkTheme}>
      <GlobalStyle />
      <PowerButton />
      <Box>
        <Vignette />
        {PARTICLES.map(p => (
          <Particle
            key={p.id}
            $left={p.left} $size={p.size} $dur={p.dur}
            $delay={p.delay} $twinkDur={p.twinkDur} $color={p.color}
          />
        ))}

        <LogoComponent theme="dark" />
        <SocialIcons theme="dark" />

        {/* BigTitle hidden on mobile — would overlap the list */}
        <BigTitleWrap>
          <BigTitle text="PROJECTS" color="rgba(172,199,180,0.15)" top="5rem" left="5rem" />
        </BigTitleWrap>

        {/* ── Project list ── */}
        <ProjectList variants={listVariants} initial="hidden" animate="show">
          {Projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              variants={rowVariants}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActiveProject(project)}
            >
              <RowLeft>
                <RowNum>0{i + 1}</RowNum>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <RowTitle>{project.name}</RowTitle>
                  <TagList>
                    {(project.tags || project.technologies || []).slice(0, 5).map((t, j) => (
                      <RowTag key={j}>{t}</RowTag>
                    ))}
                  </TagList>
                </div>
              </RowLeft>
              <TimeStamp>{project.date || "2024"}</TimeStamp>
            </ProjectRow>
          ))}
        </ProjectList>

        {/* ── Cursor-following preview (desktop only) ── */}
        <AnimatePresence>
          {hoveredId && hoveredProject && (
            <CursorPreview
              key="preview"
              style={{ left: cursor.x, top: cursor.y }}
              initial={{ opacity: 0, scale: .85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: .85 }}
              transition={{ duration: .16 }}
            >
              <PreviewCard>
                <PreviewMedia>
                  {hoveredProject.video ? (
                    <video src={hoveredProject.video} autoPlay muted loop playsInline />
                  ) : hoveredProject.img ? (
                    <img src={hoveredProject.img} alt={hoveredProject.name} />
                  ) : (
                    <PreviewPlaceholder>
                      <span>{GLYPHS[Projects.indexOf(hoveredProject) % GLYPHS.length]}</span>
                      <span>Hover Preview</span>
                    </PreviewPlaceholder>
                  )}
                </PreviewMedia>
                <PreviewFooter>
                  <span>{hoveredProject.name}</span>
                  <div />
                </PreviewFooter>
              </PreviewCard>
            </CursorPreview>
          )}
        </AnimatePresence>

        {/* ── Detail Modal ── */}
        <AnimatePresence>
          {activeProject && (
            <ModalOverlay
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .22 }}
              onClick={() => setActiveProject(null)}
            >
              <ModalCard
                key="modal"
                initial={{ opacity: 0, scale: .93, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: .93, y: 24 }}
                transition={{ duration: .3, ease: [.22, 1, .36, 1] }}
                onClick={e => e.stopPropagation()}
              >
                <ModalClose onClick={() => setActiveProject(null)}>✕</ModalClose>

                <ModalMedia>
                  {activeProject.video ? (
                    <video src={activeProject.video} autoPlay muted loop playsInline controls />
                  ) : activeProject.img ? (
                    <img src={activeProject.img} alt={activeProject.name} />
                  ) : (
                    <ModalMediaEmpty>
                      <span>{GLYPHS[Projects.indexOf(activeProject) % GLYPHS.length]}</span>
                      <span>No preview available</span>
                    </ModalMediaEmpty>
                  )}
                  <Scanlines />
                </ModalMedia>

                <ModalBody>
                  <ModalMeta>
                    <ModalTitle>{activeProject.name}</ModalTitle>
                    {activeProject.date && <ModalYear>{activeProject.date}</ModalYear>}
                  </ModalMeta>

                  <ModalDivider />

                  {activeProject.description && (
                    <ModalDesc>{activeProject.description}</ModalDesc>
                  )}

                  {(activeProject.tags || activeProject.technologies || []).length > 0 && (
                    <>
                      <SectionLabel>// Technologies Used</SectionLabel>
                      <TechGrid>
                        {(activeProject.tags || activeProject.technologies || []).map((t, i) => (
                          <TechTag key={i}>{t}</TechTag>
                        ))}
                      </TechGrid>
                    </>
                  )}

                  <SectionLabel>// Links</SectionLabel>
                  <LinkRow>
                    {activeProject.github && (
                      <ModalLink href={activeProject.github} target="_blank" rel="noopener noreferrer" $primary>
                        ⌥ GitHub
                      </ModalLink>
                    )}
                    {(activeProject.link || activeProject.demo) && (
                      <ModalLink href={activeProject.link || activeProject.demo} target="_blank" rel="noopener noreferrer">
                        ↗ Live Demo
                      </ModalLink>
                    )}
                    {!activeProject.github && !activeProject.link && !activeProject.demo && (
                      <span style={{ fontFamily:"'Courier New',monospace", fontSize:".68rem", letterSpacing:".1em", color:"#ACC7B440" }}>
                        No links available
                      </span>
                    )}
                  </LinkRow>
                </ModalBody>
              </ModalCard>
            </ModalOverlay>
          )}
        </AnimatePresence>

        <Rotate ref={yinyang}>
          <YinYang width="100%" height="100%" fill={DarkTheme.text} />
        </Rotate>
      </Box>
    </ThemeProvider>
  );
};

export default ProjectPage;