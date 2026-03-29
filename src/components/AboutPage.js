import React, { useEffect, useRef } from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'

// ── Inline DarkTheme so file is self-contained ──────────────────────────────
const DarkTheme = {
  body: '#1b1b2f',
  text: '#ffffff',
  fontFamily: "'Ubuntu Mono', monospace",
  bodyRgba: '27, 27, 47',
  textRgba: '255, 255, 255',
}

// ── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(120,80,255,0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(120,80,255,0); }
`
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
const orbit = keyframes`
  from { transform: rotate(0deg) translateX(38px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
`
const floatY = keyframes`
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-8px); }
`
const glowPulse = keyframes`
  0%,100% { opacity: .7; }
  50%     { opacity: 1; }
`

// ── Layout shells ─────────────────────────────────────────────────────────────
const Box = styled.div`
  background-color: ${p => p.theme.body};
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  font-family: 'Ubuntu Mono', monospace;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(80,40,180,.25) 0%, transparent 70%);
    pointer-events: none;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
  width: 100%;
  max-width: 900px;
  animation: ${fadeUp} .8s ease both;
`

// ── Shared card base ──────────────────────────────────────────────────────────
const Card = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: border-color .3s, transform .3s;

  &:hover {
    border-color: rgba(120,80,255,.5);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 20%, rgba(120,80,255,.08) 0%, transparent 60%);
    pointer-events: none;
  }
`

// ── Individual card placements ────────────────────────────────────────────────
// Row 1: Intro (col 1-7) | Values (col 8-12)
// Row 2: Timezone (col 1-5) | Location (col 6-9) | Availability (col 10-12)
// Row 3: CTA (col 1-4) | Resume (col 5-8) | Quote (col 9-12)

const IntroCard = styled(Card)`
  grid-column: 1 / 8;
  grid-row: 1;
  background: rgba(120,80,255,.12);
  border-color: rgba(120,80,255,.3);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 220px;
`

const ValuesCard = styled(Card)`
  grid-column: 8 / 13;
  grid-row: 1;
  min-height: 220px;
`

const TimezoneCard = styled(Card)`
  grid-column: 1 / 6;
  grid-row: 2;
`

const LocationCard = styled(Card)`
  grid-column: 6 / 10;
  grid-row: 2;
`

const AvailCard = styled(Card)`
  grid-column: 10 / 13;
  grid-row: 2;
  background: rgba(120,80,255,.15);
  border-color: rgba(120,80,255,.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const CTACard = styled(Card)`
  grid-column: 1 / 5;
  grid-row: 3;
  background: linear-gradient(135deg, rgba(120,80,255,.25) 0%, rgba(60,30,180,.2) 100%);
  border-color: rgba(120,80,255,.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .8rem;
`

const ResumeCard = styled(Card)`
  grid-column: 5 / 9;
  grid-row: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .8rem;
  text-align: center;
`

const QuoteCard = styled(Card)`
  grid-column: 9 / 13;
  grid-row: 3;
  display: flex;
  align-items: center;
  justify-content: center;
`

// ── Typography ────────────────────────────────────────────────────────────────
const Tag = styled.span`
  font-size: .65rem;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: rgba(160,130,255,.8);
  margin-bottom: .4rem;
  display: block;
`
const H1 = styled.h1`
  margin: 0 0 .4rem;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: #fff;
  font-family: 'Ubuntu Mono', monospace;
`
const Body = styled.p`
  margin: 0;
  font-size: .8rem;
  line-height: 1.65;
  color: rgba(255,255,255,.6);
`
const CardTitle = styled.h3`
  margin: 0 0 .6rem;
  font-size: .95rem;
  color: #fff;
  font-family: 'Ubuntu Mono', monospace;
`
const BigValue = styled.div`
  font-size: clamp(1.3rem, 2.5vw, 1.8rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
`

// ── Globe visual ──────────────────────────────────────────────────────────────
const GlobeWrap = styled.div`
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 130px;
  height: 130px;
  opacity: .5;
`
const GlobeRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(120,80,255,.5);
  animation: ${spin} ${p => p.dur || '8s'} linear infinite ${p => p.rev ? 'reverse' : ''};
`
const GlobeCore = styled.div`
  position: absolute;
  inset: 20%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(140,100,255,.4), rgba(60,30,140,.15));
  border: 1px solid rgba(120,80,255,.3);
  animation: ${glowPulse} 3s ease-in-out infinite;
`
const OrbitDot = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  width: 6px; height: 6px;
  margin: -3px;
  border-radius: 50%;
  background: #a07fff;
  animation: ${orbit} ${p => p.dur} linear infinite;
`

// ── Clock visual ──────────────────────────────────────────────────────────────
const ClockFace = styled.div`
  width: 60px; height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(120,80,255,.6);
  position: relative;
  flex-shrink: 0;
`
const Hand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 2px;
  background: ${p => p.color || '#fff'};
  width: ${p => p.w || 2}px;
  height: ${p => p.h || 20}px;
  margin-left: -1px;
  transform: rotate(${p => p.deg || 0}deg);
`

// ── Availability dot ──────────────────────────────────────────────────────────
const AvailDot = styled.div`
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #4ade80;
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: .5rem;
`

// ── Buttons ───────────────────────────────────────────────────────────────────
const Btn = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .55rem 1.2rem;
  border-radius: 999px;
  font-family: 'Ubuntu Mono', monospace;
  font-size: .8rem;
  letter-spacing: .05em;
  transition: all .25s;
`
const PrimaryBtn = styled(Btn)`
  background: rgba(120,80,255,.25);
  border: 1px solid rgba(120,80,255,.6);
  color: #fff;
  &:hover { background: rgba(120,80,255,.45); }
`
const OutlineBtn = styled(Btn)`
  border: 1px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.8);
  &:hover { border-color: rgba(120,80,255,.6); color: #fff; }
`

// ── Values list ───────────────────────────────────────────────────────────────
const ValuesList = styled.ul`
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: .55rem;
`
const ValueItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: .6rem;
  font-size: .8rem;
  color: rgba(255,255,255,.7);
  line-height: 1.4;
  &::before {
    content: '→';
    color: #a07fff;
    flex-shrink: 0;
    margin-top: 1px;
  }
`

// ── Floating emoji ────────────────────────────────────────────────────────────
const FloatEmoji = styled.div`
  font-size: 2rem;
  animation: ${floatY} 3s ease infinite;
`

// ── Quote ─────────────────────────────────────────────────────────────────────
const QuoteText = styled.blockquote`
  margin: 0;
  font-size: .8rem;
  font-style: italic;
  color: rgba(255,255,255,.55);
  line-height: 1.7;
  border-left: 2px solid rgba(120,80,255,.6);
  padding-left: .9rem;
`

// ── Live Clock ────────────────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = React.useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

// ── Dots decoration ───────────────────────────────────────────────────────────
const DotsWrap = styled.div`
  position: absolute;
  top: 1rem; right: 1rem;
  display: flex; gap: 5px;
`
const Dot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${p => p.c};
  opacity: .7;
`

// ── Component ─────────────────────────────────────────────────────────────────
const AboutPage = () => {
  const time = useClock()
  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds()
  const hDeg = (h % 12) * 30 + m * 0.5
  const mDeg = m * 6
  const sDeg = s * 6

  // IST offset
  const istOffset = 5.5 * 60
  const utcMin = time.getTime() / 60000 + time.getTimezoneOffset()
  const istTime = new Date((utcMin + istOffset) * 60000)
  const istH = istTime.getUTCHours()
  const istM = String(istTime.getUTCMinutes()).padStart(2, '0')
  const ampm = istH >= 12 ? 'PM' : 'AM'
  const displayH = istH % 12 || 12

  return (
    <ThemeProvider theme={DarkTheme}>
      <Box>
        <Grid>

          {/* ── Intro ── */}
          <IntroCard>
            <DotsWrap><Dot c="#ff5f57"/><Dot c="#febc2e"/><Dot c="#28c840"/></DotsWrap>
            <Tag>// about.me</Tag>
            <H1>Hi, I'm Ali Sanati</H1>
            <Body>
              Over the last 4 years, I've developed frontend and backend skills
              to deliver dynamic, responsive software and web applications.
              I love clean code, thoughtful UX, and building things that matter.
            </Body>
          </IntroCard>

          {/* ── Values ── */}
          <ValuesCard>
            <Tag>// my values</Tag>
            <CardTitle>What I Stand For</CardTitle>
            <ValuesList>
              <ValueItem>Clean, readable code over clever hacks</ValueItem>
              <ValueItem>User-first thinking in every decision</ValueItem>
              <ValueItem>Continuous learning & growth mindset</ValueItem>
              <ValueItem>Transparent, honest collaboration</ValueItem>
              <ValueItem>Shipping with intention — quality greater than speed</ValueItem>
            </ValuesList>
          </ValuesCard>

          {/* ── Timezone ── */}
          <TimezoneCard>
            <Tag>// time_zone</Tag>
            <CardTitle>Time Zone</CardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '.4rem' }}>
              <ClockFace>
                <Hand w={2} h={17} deg={hDeg} />
                <Hand w={2} h={22} deg={mDeg} />
                <Hand color="#a07fff" w={1} h={24} deg={sDeg} />
                <div style={{ position:'absolute', top:'50%', left:'50%', width:4, height:4, borderRadius:'50%', background:'#a07fff', transform:'translate(-50%,-50%)' }} />
              </ClockFace>
              <div>
                <BigValue>{displayH}:{istM} {ampm}</BigValue>
                <Body style={{ marginTop: '.2rem' }}>IST — UTC+5:30</Body>
                <Body>India Standard Time</Body>
              </div>
            </div>
            <Body style={{ marginTop: '.8rem' }}>
              Open to remote work worldwide — async friendly ✦
            </Body>
          </TimezoneCard>

          {/* ── Location ── */}
          <LocationCard>
            <Tag>// location</Tag>
            <CardTitle>Based in India</CardTitle>
            <Body style={{ marginBottom: '.8rem' }}>
              Working from India, collaborating globally.<br/>
              Comfortable across all time zones for remote teams.
            </Body>
            <GlobeWrap>
              <GlobeRing dur="10s" />
              <GlobeRing dur="16s" rev style={{ inset: '12%' }} />
              <GlobeRing dur="6s"  style={{ inset: '24%', borderStyle: 'dashed' }} />
              <GlobeCore />
              <OrbitDot dur="6s" />
              <OrbitDot dur="10s" style={{ animationDelay: '-4s' }} />
            </GlobeWrap>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {['🌏 Asia/Kolkata', '🤝 Remote-first', '🌐 Global'].map(t => (
                <span key={t} style={{
                  fontSize: '.7rem', padding: '.2rem .7rem',
                  border: '1px solid rgba(120,80,255,.3)',
                  borderRadius: 999, color: 'rgba(255,255,255,.6)'
                }}>{t}</span>
              ))}
            </div>
          </LocationCard>

          {/* ── Availability ── */}
          <AvailCard>
            <AvailDot />
            <Tag style={{ textAlign: 'center' }}>// status</Tag>
            <BigValue style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              Available<br/>for Work
            </BigValue>
            <Body style={{ marginTop: '.5rem', fontSize: '.72rem' }}>
              Freelance &amp; full-time
            </Body>
          </AvailCard>

          {/* ── CTA ── */}
          <CTACard>
            <CardTitle>Let's build something together</CardTitle>
            <Body style={{ fontSize: '.75rem' }}>
              Have a project in mind? I'd love to hear about it.
            </Body>
            <PrimaryBtn onClick={() => navigator.clipboard?.writeText('ali.sanati@example.com')}>
              <span>📋</span> Copy Email
            </PrimaryBtn>
          </CTACard>

          {/* ── Resume ── */}
          <ResumeCard>
            <Tag>// resume</Tag>
            <FloatEmoji>📄</FloatEmoji>
            <CardTitle style={{ marginBottom: '.2rem' }}>View Resume</CardTitle>
            <Body style={{ fontSize: '.75rem' }}>
              4 years of experience across frontend &amp; backend
            </Body>
            <OutlineBtn>
              Download CV →
            </OutlineBtn>
          </ResumeCard>

          {/* ── Quote ── */}
          <QuoteCard>
            <QuoteText>
              "Everything is an art when you put your consciousness into it."
              <div style={{ marginTop: '.6rem', color: 'rgba(160,130,255,.7)', fontStyle: 'normal', fontSize: '.7rem' }}>— Ali Sanati</div>
            </QuoteText>
          </QuoteCard>

        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default AboutPage