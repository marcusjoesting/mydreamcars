import React, { useRef, useEffect, useState, Suspense } from "react";
import "./App.scss";
//Components
import Header from "./components/header";
import { Section } from "./components/section";

// Page State
import state from "./components/state";

// R3F
import { Canvas, useFrame } from "react-three-fiber";
import { Html, useProgress, useGLTFLoader } from "drei";

// React Spring
import { a, useTransition } from "@react-spring/web";
//Intersection Observer
import { useInView } from "react-intersection-observer";

function Model({ url }) {
  const gltf = useGLTFLoader(url, true);
  return <primitive object={gltf.scene} dispose={null} />;
}

const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} />
      {/* Diretion light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight Large overhead light */}
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  );
};

const HTMLContent = ({
  domContent,
  children,
  bgColor,
  modelPath,
  position,
  modelScale
}) => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));
  const [refItem, inView] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -45, 0]} scale={modelScale ? modelScale: [1,1,1]}>
          <Model url={modelPath} />
        </mesh>
        <Html fullscreen portal={domContent}>
          <div ref={refItem} className='container'>
            <h1 className='title'>{children}</h1>
          </div>
        </Html>
      </group>
    </Section>
  );
};

function Loader() {
  const { active, progress } = useProgress();
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress },
  });
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className='loading' style={{ opacity }}>
          <div className='loading-bar-container'>
            <a.div className='loading-bar' style={{ width: progress }}></a.div>
          </div>
        </a.div>
      )
  );
}

export default function App() {
  const [events, setEvents] = useState();
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      <Header />
      {/* R3F Canvas */}
      <Canvas
        concurrent
        colorManagement
        camera={{ position: [0, 0, 120], fov: 70 }}>
        {/* Lights Component */}
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent
            domContent={domContent}
            bgColor='#A4A6A6'
            modelPath='/tesla_model_s/scene.gltf'
            position={250}
            modelScale={[0.3,0.3,0.3]}
            >
              <span>Tesla</span>
              <span>Model S</span>
              <p style={{fontSize: 30}}>$74,990</p>
          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='#00CDFF'
            modelPath='/bmw_i8/scene.gltf'
            position={0}
            modelScale={[0.3,0.3,0.3]}
            >
            <span>BMW i8</span>
            <p style={{fontSize: 30}}>$147,500</p>
          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='#FCAC02'
            modelPath='/lamborghini_terzor/scene.gltf'
            modelScale={[25,25,25]}
            position={-250}>
            <span>Lamborghini</span>
            <span>Terzor</span>
            <p style={{fontSize: 30}}>$2,500,000</p>
          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='black'
            modelPath='/audi_r8_3d_model/scene.gltf'
            position={-500}
            modelScale={[20,20,20]}
            >
              <span>Audi R8</span>
              <p style={{fontSize: 30}}>$169,900</p>

          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='silver'
            modelPath='/tesla_cybertruck/scene.gltf'
            position={-750}
            modelScale={[20,20,20]}
            >
              <span>Tesla Cybertruck</span>
              <p style={{fontSize: 30}}>$39,900</p>

          </HTMLContent>
        </Suspense>
      </Canvas>
      <Loader />
      <div
        className='scrollArea'
        ref={scrollArea}
        onScroll={onScroll}
        {...events}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  );
}
