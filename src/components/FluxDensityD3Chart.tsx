import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Activity, Play, Pause, RefreshCw, Flame, Zap, Gauge, Sparkles, HelpCircle } from 'lucide-react';

interface FluxDensityD3ChartProps {
  currentTemp: number; // Furnace sintering temperature in °C (900 - 1350)
  calcinationTemp: number;
  magneticPulse: number; // Tesla (0.5 - 3.5)
  inertAtmosphere: boolean;
  oreType: string;
}

interface DataPoint {
  time: number;
  fluxGauss: number;
  fluxTesla: number;
  temp: number;
}

export const FluxDensityD3Chart: React.FC<FluxDensityD3ChartProps> = ({
  currentTemp,
  magneticPulse,
  inertAtmosphere,
  oreType
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'stream' | 'tempCurve'>('stream');
  const [streamData, setStreamData] = useState<DataPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Calculate simulated instantaneous flux density in Gauss & Tesla based on furnace temperature
  const calculateFlux = useMemo(() => {
    return (temp: number, noise: number = 0) => {
      // Optimal sintering window is 1060°C - 1100°C for Nd2Fe14B
      const optimalTemp = 1080;
      const delta = Math.abs(temp - optimalTemp);
      
      // Bell-shaped thermal kinetics curve for liquid-phase densification
      let thermalEfficiency = Math.exp(-Math.pow(delta / 125, 2));
      if (temp < 980) {
        thermalEfficiency *= (temp - 880) / 100;
        if (thermalEfficiency < 0.1) thermalEfficiency = 0.1;
      }
      if (temp > 1200) {
        // High temp oxidation and abnormal Nd-rich grain boundary degradation
        thermalEfficiency *= Math.max(0.2, 1 - (temp - 1200) / 250);
      }

      const pulseFactor = Math.min(1.0, magneticPulse / 2.8);
      const atmosFactor = inertAtmosphere ? 1.0 : 0.68;
      const oreFactor = oreType === 'Bastnäsite' ? 1.0 : oreType === 'Monazite' ? 0.93 : 0.88;

      // Base peak flux density for sintered NdFeB is ~14,800 Gauss (1.48 Tesla)
      const peakGauss = 14800;
      const baseFluxGauss = peakGauss * thermalEfficiency * pulseFactor * atmosFactor * oreFactor;
      
      // Add realistic thermal micro-fluctuations (Barkhausen jump noise)
      const simulatedGauss = Math.max(800, Math.round(baseFluxGauss + noise));
      const simulatedTesla = Number((simulatedGauss / 10000).toFixed(3));

      return {
        gauss: simulatedGauss,
        tesla: simulatedTesla
      };
    };
  }, [magneticPulse, inertAtmosphere, oreType]);

  // Current instantaneous values
  const currentFlux = useMemo(() => {
    return calculateFlux(currentTemp, 0);
  }, [calculateFlux, currentTemp]);

  // Initialize and update real-time rolling data stream
  useEffect(() => {
    // Generate initial history
    const initial: DataPoint[] = [];
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      const t = now - i * 500;
      const noise = (Math.random() - 0.5) * 220;
      const flux = calculateFlux(currentTemp, noise);
      initial.push({
        time: t,
        fluxGauss: flux.gauss,
        fluxTesla: flux.tesla,
        temp: currentTemp
      });
    }
    setStreamData(initial);
  }, []);

  // Real-time ticking stream
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setStreamData(prev => {
        const now = Date.now();
        // Slight natural variance simulating Hall effect probe telemetry
        const noise = (Math.random() - 0.5) * (currentTemp > 1200 ? 450 : 180);
        const flux = calculateFlux(currentTemp, noise);
        const newPoint: DataPoint = {
          time: now,
          fluxGauss: flux.gauss,
          fluxTesla: flux.tesla,
          temp: currentTemp
        };

        const updated = [...prev.slice(-40), newPoint];
        return updated;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isRunning, currentTemp, calculateFlux]);

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = 230;
    const margin = { top: 25, right: 35, bottom: 35, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Definitions (Gradients & Filters)
    const defs = svg.append('defs');

    // Flux gradient
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'flux-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#39ff14')
      .attr('stop-opacity', 0.45);

    areaGradient
      .append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#00e5ff')
      .attr('stop-opacity', 0.15);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0a0a0a')
      .attr('stop-opacity', 0.0);

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Background grid lines pattern
    const gridG = g.append('g').attr('class', 'grid');

    if (viewMode === 'stream') {
      // --- STREAM VIEW ---
      if (streamData.length === 0) return;

      const xExtent = d3.extent(streamData, d => d.time) as [number, number];
      const xScale = d3
        .scaleLinear()
        .domain(xExtent[0] && xExtent[1] ? xExtent : [Date.now() - 15000, Date.now()])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, 16000])
        .range([innerHeight, 0])
        .nice();

      // Horizontal grid lines
      gridG
        .selectAll('line.horizontal')
        .data(yScale.ticks(5))
        .enter()
        .append('line')
        .attr('class', 'horizontal')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', '#222222')
        .attr('stroke-dasharray', '2,3');

      // Optimal window highlight band
      const yOptHigh = yScale(15000);
      const yOptLow = yScale(12000);
      g.append('rect')
        .attr('x', 0)
        .attr('width', innerWidth)
        .attr('y', yOptHigh)
        .attr('height', Math.max(0, yOptLow - yOptHigh))
        .attr('fill', '#39ff14')
        .attr('opacity', 0.05);

      g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', yOptHigh + 12)
        .attr('text-anchor', 'end')
        .attr('fill', '#39ff14')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('opacity', 0.6)
        .text('TARGET N52 WINDOW (≥1.2 T)');

      // Area generator
      const areaGen = d3
        .area<DataPoint>()
        .x(d => xScale(d.time))
        .y0(innerHeight)
        .y1(d => yScale(d.fluxGauss))
        .curve(d3.curveMonotoneX);

      // Line generator
      const lineGen = d3
        .line<DataPoint>()
        .x(d => xScale(d.time))
        .y(d => yScale(d.fluxGauss))
        .curve(d3.curveMonotoneX);

      // Draw Area
      g.append('path')
        .datum(streamData)
        .attr('fill', 'url(#flux-gradient)')
        .attr('d', areaGen);

      // Draw Line
      g.append('path')
        .datum(streamData)
        .attr('fill', 'none')
        .attr('stroke', '#39ff14')
        .attr('stroke-width', 2.2)
        .attr('filter', 'url(#glow)')
        .attr('d', lineGen);

      // Draw current live pulse point
      const lastPoint = streamData[streamData.length - 1];
      if (lastPoint) {
        const lastX = xScale(lastPoint.time);
        const lastY = yScale(lastPoint.fluxGauss);

        // Ping circle
        g.append('circle')
          .attr('cx', lastX)
          .attr('cy', lastY)
          .attr('r', 6)
          .attr('fill', '#33ffcc')
          .attr('opacity', 0.8)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '4;11;4')
          .attr('dur', '1.6s')
          .attr('repeatCount', 'indefinite');

        g.append('circle')
          .attr('cx', lastX)
          .attr('cy', lastY)
          .attr('r', 3.5)
          .attr('fill', '#ffffff')
          .attr('stroke', '#39ff14')
          .attr('stroke-width', 2);
      }

      // X Axis (Time)
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => {
          const dt = new Date(d as number);
          return `${dt.getMinutes()}:${String(dt.getSeconds()).padStart(2, '0')}`;
        });

      const xAxisG = g
        .append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);

      xAxisG.select('.domain').attr('stroke', '#444444');
      xAxisG.selectAll('.tick line').attr('stroke', '#333333');
      xAxisG.selectAll('.tick text').attr('fill', '#888888').attr('font-size', '10px').attr('font-family', 'monospace');

      // Y Axis (Gauss)
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `${Number(d) / 1000}k G`);

      const yAxisG = g.append('g').call(yAxis);
      yAxisG.select('.domain').attr('stroke', '#444444');
      yAxisG.selectAll('.tick line').attr('stroke', '#333333');
      yAxisG.selectAll('.tick text').attr('fill', '#39ff14').attr('font-size', '10px').attr('font-family', 'monospace');

      // Secondary Tesla Axis on Right
      const yTeslaScale = d3
        .scaleLinear()
        .domain([0, 1.6])
        .range([innerHeight, 0]);

      const yAxisRight = d3
        .axisRight(yTeslaScale)
        .ticks(4)
        .tickFormat(d => `${d} T`);

      const yAxisRightG = g
        .append('g')
        .attr('transform', `translate(${innerWidth},0)`)
        .call(yAxisRight);

      yAxisRightG.select('.domain').attr('stroke', '#444444');
      yAxisRightG.selectAll('.tick line').attr('stroke', '#333333');
      yAxisRightG.selectAll('.tick text').attr('fill', '#33ffcc').attr('font-size', '10px').attr('font-family', 'monospace');

    } else {
      // --- TEMPERATURE CURVE VIEW (Flux vs Temperature B(T)) ---
      const tempRange = d3.range(900, 1355, 10);
      const curveData = tempRange.map(t => {
        const flux = calculateFlux(t, 0);
        return {
          temp: t,
          gauss: flux.gauss,
          tesla: flux.tesla
        };
      });

      const xScale = d3
        .scaleLinear()
        .domain([900, 1350])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, 16000])
        .range([innerHeight, 0])
        .nice();

      // Optimal window highlight
      const xOptMin = xScale(1060);
      const xOptMax = xScale(1100);
      g.append('rect')
        .attr('x', xOptMin)
        .attr('width', xOptMax - xOptMin)
        .attr('y', 0)
        .attr('height', innerHeight)
        .attr('fill', '#e6a817')
        .attr('opacity', 0.1);

      g.append('text')
        .attr('x', (xOptMin + xOptMax) / 2)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e6a817')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text('EUTECTIC (1060-1100°C)');

      // Line and Area
      const areaGen = d3
        .area<{ temp: number; gauss: number }>()
        .x(d => xScale(d.temp))
        .y0(innerHeight)
        .y1(d => yScale(d.gauss))
        .curve(d3.curveMonotoneX);

      const lineGen = d3
        .line<{ temp: number; gauss: number }>()
        .x(d => xScale(d.temp))
        .y(d => yScale(d.gauss))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(curveData)
        .attr('fill', 'url(#flux-gradient)')
        .attr('d', areaGen);

      g.append('path')
        .datum(curveData)
        .attr('fill', 'none')
        .attr('stroke', '#33ffcc')
        .attr('stroke-width', 2.5)
        .attr('filter', 'url(#glow)')
        .attr('d', lineGen);

      // Current temperature marker line & dot
      const curX = xScale(currentTemp);
      const curY = yScale(currentFlux.gauss);

      g.append('line')
        .attr('x1', curX)
        .attr('x2', curX)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#ff3344')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      g.append('circle')
        .attr('cx', curX)
        .attr('cy', curY)
        .attr('r', 7)
        .attr('fill', '#ff3344')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('filter', 'url(#glow)');

      g.append('text')
        .attr('x', curX + 8)
        .attr('y', Math.max(20, curY - 10))
        .attr('fill', '#ffdd55')
        .attr('font-weight', 'bold')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`CURRENT: ${currentTemp}°C (${currentFlux.gauss} G)`);

      // X Axis (Temperature °C)
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(8)
        .tickFormat(d => `${d}°C`);

      const xAxisG = g
        .append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);

      xAxisG.select('.domain').attr('stroke', '#444444');
      xAxisG.selectAll('.tick line').attr('stroke', '#333333');
      xAxisG.selectAll('.tick text').attr('fill', '#e0a845').attr('font-size', '10px').attr('font-family', 'monospace');

      // Y Axis (Gauss)
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `${Number(d) / 1000}k G`);

      const yAxisG = g.append('g').call(yAxis);
      yAxisG.select('.domain').attr('stroke', '#444444');
      yAxisG.selectAll('.tick line').attr('stroke', '#333333');
      yAxisG.selectAll('.tick text').attr('fill', '#39ff14').attr('font-size', '10px').attr('font-family', 'monospace');
    }

    // Interactive Hover Overlay
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    overlay.on('mousemove', (event: MouseEvent) => {
      const [mx] = d3.pointer(event);
      if (viewMode === 'stream') {
        const xExtent = d3.extent(streamData, d => d.time) as [number, number];
        const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
        const timeVal = xScale.invert(mx);
        const bisector = d3.bisector<DataPoint, number>(d => d.time).left;
        const index = bisector(streamData, timeVal);
        const point = streamData[index] || streamData[streamData.length - 1];
        setHoveredPoint(point || null);
      }
    });

    overlay.on('mouseleave', () => {
      setHoveredPoint(null);
    });

  }, [streamData, viewMode, currentTemp, currentFlux, calculateFlux]);

  return (
    <div className="bg-[#0b0805] border-3 border-[#7a0016] rounded-xl p-3 sm:p-4 text-[#eae0d2] shadow-2xl space-y-3">
      {/* Top Header bar with status indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#4d101a] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#24080e] border border-[#a11d33] flex items-center justify-center text-[#ff3366]">
            <Activity className="w-4 h-4 animate-pulse text-[#39ff14]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#39ff14]">
                D3.js Real-Time Telemetry Node
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a3821] text-[#71ff8b] border border-[#2b773c]">
                SIMULATED FLUX STREAM
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#ffd285] font-cinzel leading-tight">
              Neodymium Sintering Magnetic Flux Density Stream (Gauss / Tesla)
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Mode Switcher */}
          <div className="bg-[#1c120c] p-0.5 rounded-lg border border-[#6b251a] flex">
            <button
              onClick={() => setViewMode('stream')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                viewMode === 'stream'
                  ? 'bg-[#7a0016] text-[#fff] font-bold shadow'
                  : 'text-[#a89078] hover:text-[#fff]'
              }`}
            >
              Time Series
            </button>
            <button
              onClick={() => setViewMode('tempCurve')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                viewMode === 'tempCurve'
                  ? 'bg-[#7a0016] text-[#fff] font-bold shadow'
                  : 'text-[#a89078] hover:text-[#fff]'
              }`}
            >
              B(T) Curve
            </button>
          </div>

          {/* Pause / Play */}
          {viewMode === 'stream' && (
            <button
              onClick={() => setIsRunning(r => !r)}
              className="px-2 py-1 rounded bg-[#211208] hover:bg-[#381e0d] text-[#e0a845] border border-[#6b3512] flex items-center gap-1"
              title={isRunning ? 'Pause stream' : 'Resume stream'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#39ff14]" />}
            </button>
          )}
        </div>
      </div>

      {/* Numerical Matrix HUD readout display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-[#140b06] border border-[#4d1f0f] rounded p-2">
          <span className="text-[10px] text-[#8f745e] block">INSTANTANEOUS FLUX:</span>
          <div className="text-base sm:text-lg font-black text-[#39ff14] flex items-baseline gap-1 mt-0.5">
            <span>{currentFlux.gauss.toLocaleString()}</span>
            <span className="text-[11px] font-normal text-[#88ffaa]">Gauss</span>
          </div>
          <span className="text-[10px] text-[#33ffcc]">
            ({currentFlux.tesla} Tesla)
          </span>
        </div>

        <div className="bg-[#140b06] border border-[#4d1f0f] rounded p-2">
          <span className="text-[10px] text-[#8f745e] block">FURNACE TEMPERATURE:</span>
          <div className="text-base sm:text-lg font-black text-[#ffaa33] flex items-baseline gap-1 mt-0.5">
            <span>{currentTemp}°C</span>
          </div>
          <span className={`text-[10px] ${
            currentTemp >= 1060 && currentTemp <= 1100 ? 'text-[#39ff14]' : 'text-[#ff6644]'
          }`}>
            {currentTemp >= 1060 && currentTemp <= 1100 ? '✓ Eutectic Liquid Phase' : currentTemp < 1060 ? '▲ Sub-optimal Densification' : '▼ Thermal Grain Growth'}
          </span>
        </div>

        <div className="bg-[#140b06] border border-[#4d1f0f] rounded p-2">
          <span className="text-[10px] text-[#8f745e] block">ALIGNMENT RETENTION:</span>
          <div className="text-base sm:text-lg font-black text-[#33ffcc] flex items-baseline gap-1 mt-0.5">
            <span>{Math.round((currentFlux.gauss / 14800) * 100)}%</span>
          </div>
          <span className="text-[10px] text-[#a0c0c0]">
            of theoretical max (14.8 kG)
          </span>
        </div>

        <div className="bg-[#140b06] border border-[#4d1f0f] rounded p-2">
          <span className="text-[10px] text-[#8f745e] block">ATMOSPHERE & FEED:</span>
          <div className="text-xs font-bold text-[#e6c280] truncate mt-1">
            {oreType}
          </div>
          <span className={`text-[10px] ${inertAtmosphere ? 'text-[#39ff14]' : 'text-[#ff4444]'}`}>
            {inertAtmosphere ? 'Argon Reducing (Ar)' : 'Air (Oxidizing Risk)'}
          </span>
        </div>
      </div>

      {/* D3.js Chart Viewport Canvas */}
      <div className="relative bg-[#070503] rounded-lg border border-[#4d151e] p-1.5 shadow-inner" ref={containerRef}>
        <svg ref={svgRef} className="w-full block"></svg>

        {/* Hover telemetry readout */}
        {hoveredPoint && (
          <div className="absolute top-3 left-16 bg-[#160b06]/95 border border-[#cfa82d] rounded px-2.5 py-1 text-[11px] font-mono text-[#f7e6cf] shadow-xl pointer-events-none">
            <span className="text-[#39ff14] font-bold">{hoveredPoint.fluxGauss} Gauss</span> ({hoveredPoint.fluxTesla} T) · Sinter Temp: {hoveredPoint.temp}°C
          </div>
        )}
      </div>

      {/* Traditional Arthashastra Akaradhyaksha Shloka Accordion Panel */}
      <div className="bg-[#160b06] border-l-4 border-[#7a0016] rounded-r-lg p-3 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#ffdd88] font-devanagari text-xs sm:text-sm">
            आकराध्यक्षः खनिशास्त्रमणिरसधातुपरीक्षाक्षस्तज्ज्ञसखो वा ... कर्मान्तं कारयेत् ॥
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#331109] text-[#e0a845] border border-[#6b2512] font-cinzel">
            Arthashastra 2.12
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-[#c9b199] pt-1">
          <div>
            <strong className="text-[#e2a84d] block text-[10px] uppercase font-mono">🌐 English Core Manual:</strong>
            The Superintendent of Mines (Akaradhyaksha) manages raw mineral extraction veins, parsing Neodymium complexes with high-precision furnace telemetry.
          </div>
          <div>
            <strong className="text-[#e2a84d] block text-[10px] uppercase font-mono">🕉️ Hindi Translation Guide:</strong>
            खदान प्रमुख (आकराध्यक्ष) को भूविज्ञान और धातुकर्म के विशेषज्ञों के साथ मिलकर ही विनिर्माण कारखानों को स्थापित और संचालित करना चाहिए।
          </div>
          <div>
            <strong className="text-[#e2a84d] block text-[10px] uppercase font-mono">🌾 Odia Translation Guide:</strong>
            ଖଣି ବିଭାଗର ମୁଖ୍ୟ (ଆକରାଧ୍ୟକ୍ଷ) ଭୂବିଜ୍ଞାନ ଓ ଧାତୁ ଶୋଧନ ବିଶେଷଜ୍ଞମାନଙ୍କ ସହିତ ମିଳିତ ହୋଇ ଶିଳ୍ପ କାରଖାନା ପ୍ରତିଷ୍ଠା ଓ ପରିଚାଳନା କରିବା ଆବଶ୍ୟକ।
          </div>
        </div>
      </div>
    </div>
  );
};
