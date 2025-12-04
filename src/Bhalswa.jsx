// EcoSynergyBhalswa.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Chart } from "chart.js/auto";

/* -------------------------------
   DEMO DATA GENERATION FUNCTIONS
--------------------------------- */

const demoDates = (() => {
  const start = new Date("2022-04-01");
  const end = new Date("2022-05-31");
  const arr = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    arr.push(new Date(d).toISOString().slice(0, 10));
  }
  return arr;
})();

const demoTemp = demoDates.map((d) => {
  const day = new Date(d).getDate();
  let v = 34 + Math.sin(day / 6) * 3 + (Math.random() * 2 - 1);
  if (d >= "2022-04-20" && d <= "2022-04-30") v += 7 + Math.random() * 3;
  return +v.toFixed(1);
});

const demoVIIRS = demoDates.map((d) =>
  d >= "2022-04-20" && d <= "2022-05-08"
    ? Math.round(1 + Math.random() * 3)
    : Math.round(Math.random() * 0.2)
);

const demoPM = demoDates.map((d, i) => {
  let base = 75 + Math.sin(i / 4) * 6 + (Math.random() * 8 - 4);
  if (d >= "2022-04-20" && d <= "2022-05-08") base += 40 + Math.random() * 20;
  return Math.round(base);
});

const demoPlasticMass = demoDates.map((d) => {
  let m = 600 + Math.round(Math.random() * 80 - 40);
  if (d >= "2022-04-20" && d <= "2022-05-08") m += 300;
  return +(m * 0.18).toFixed(1);
});

const demoGT = demoDates.map((d) => {
  let g = 40 + Math.round(Math.random() * 6 - 3);
  if (d >= "2022-04-22" && d <= "2022-05-05") g += 30 + Math.round(Math.random() * 15);
  return g;
});

/* -------------------------------
   SCORE HELPERS
--------------------------------- */

function computeWorkerVuln(pm, temp) {
  const pollutionComp = Math.min(70, ((pm - 10) / 190) * 70);
  const heatComp = Math.max(0, Math.min(30, ((temp - 25) / 15) * 30));
  return Math.round(Math.min(100, pollutionComp + heatComp));
}

function norm(x, min, max) {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (x - min) / (max - min)));
}

/* -------------------------------
   BUILD FULL DATASET
--------------------------------- */

const baseDataset = (() => {
  const ds = demoDates.map((date, i) => ({
    date,
    temp: demoTemp[i],
    pm: demoPM[i],
    viirs: demoVIIRS[i],
    plastic: demoPlasticMass[i],
    gt: demoGT[i]
  }));

  const pmVals = ds.map((d) => d.pm);
  const gtVals = ds.map((d) => d.gt);
  const plasticVals = ds.map((d) => d.plastic);

  const pmMin = Math.min(...pmVals),
    pmMax = Math.max(...pmVals),
    gtMin = Math.min(...gtVals),
    gtMax = Math.max(...gtVals),
    pMin = Math.min(...plasticVals),
    pMax = Math.max(...plasticVals);

  ds.forEach((d) => {
    const pmN = norm(d.pm, pmMin, pmMax);
    const gtN = norm(d.gt, gtMin, gtMax);
    const pN = norm(d.plastic, pMin, pMax);

    d.workerVuln = computeWorkerVuln(d.pm, d.temp);
    d.healthScore = +(0.5 * gtN + 0.3 * pmN + 0.2 * (d.workerVuln / 100)).toFixed(3);

    const viirsFlag = d.viirs > 0 ? 1 : 0;
    d.plasticScore = +(
      0.5 * viirsFlag +
      0.25 * pN +
      0.25 * (d.plastic / pMax)
    ).toFixed(3);

    d.combined = +(d.healthScore + d.plasticScore).toFixed(3);
  });

  return ds;
})();

/* -------------------------------
   RECOMMENDATION ENGINE
--------------------------------- */

function generateRecommendations(d) {
  const recs = [];

  // 🔥 PLASTIC / FIRE RISK
  if (d.plasticScore >= 0.6 || d.viirs > 1) {
    recs.push(
      "<strong>Immediate:</strong> Deploy firefighting teams, issue N95 mask advisories, suspend outdoor classes and sports, and restrict access around the landfill perimeter."
    );
  } else if (d.plasticScore >= 0.35) {
    recs.push(
      "<strong>Short-term:</strong> Increase surveillance, restrict open burning, limit public and waste-picker access near hotspots, and pre-position firefighting resources."
    );
  } else {
    recs.push(
      "<strong>Maintain:</strong> Routine monitoring, hotspot patrolling, and controlled waste placement to avoid fresh ignition zones."
    );
  }

  // 🏥 HEALTH SYSTEM RESPONSE
  if (d.healthScore >= 0.6) {
    recs.push(
      "<strong>Health system:</strong> Activate mobile respiratory clinics, alert nearby hospitals and clinics, and stock inhalers, steroids, and N95 masks for vulnerable groups."
    );
  } else if (d.healthScore >= 0.4) {
    recs.push(
      "<strong>Health system:</strong> Provide PPE and N95/KN95 masks to sanitation workers and firefighters, and notify local PHCs about likely spike in respiratory complaints."
    );
  } else {
    recs.push(
      "<strong>Health system:</strong> Continue routine population health tracking and periodic lung-function screening for workers and nearby residents."
    );
  }

  // 😷 COMMUNITY PREVENTIVE ACTIONS
  let precautions;
  if (d.healthScore >= 0.6) {
    precautions =
      "<strong>Precautions for residents:</strong> Stay indoors as much as possible; wear N95 or KN95 masks outdoors; avoid morning/evening walks near the landfill; keep windows closed; use air purifiers or DIY filters if available; ensure children, elderly, and those with asthma strictly avoid the smoke plume.";
  } else if (d.healthScore >= 0.4) {
    precautions =
      "<strong>Precautions for residents:</strong> Prefer wearing masks outdoors (especially N95/KN95 near the landfill), avoid intense outdoor exercise, keep drinking water handy to stay hydrated, and monitor children and elderly for cough, wheeze, or eye irritation.";
  } else {
    precautions =
      "<strong>Precautions for residents:</strong> Encourage mask use for workers near the site, avoid burning waste at household or community level, and report any visible smoke or flare-ups to local authorities early.";
  }
  recs.push(precautions);

  return recs;
}

/* -------------------------------
   RISK META (for badges)
--------------------------------- */

function getRiskMeta(d) {
  const combined = d.combined;

  let label, className;
  if (combined >= 1.3) {
    label = "Severe risk";
    className = "badge-severe";
  } else if (combined >= 1.0) {
    label = "High risk";
    className = "badge-high";
  } else if (combined >= 0.7) {
    label = "Moderate risk";
    className = "badge-moderate";
  } else {
    label = "Low risk";
    className = "badge-low";
  }

  let phase;
  if (d.date < "2022-04-20") phase = "Pre-fire phase";
  else if (d.date <= "2022-05-08") phase = "Active fire phase";
  else phase = "Post-fire phase";

  return { label, className, phase };
}

/* -------------------------------
   MAIN COMPONENT
--------------------------------- */

export default function EcoSynergyBhalswa() {
  const [enlargeChart, setEnlargeChart] = useState(false);
  const [selectedDate, setSelectedDate] = useState(baseDataset[0].date);
  const [filterFrom, setFilterFrom] = useState(baseDataset[0].date);
  const [filterTo, setFilterTo] = useState(
    baseDataset[baseDataset.length - 1].date
  );
  const [filterRange, setFilterRange] = useState({
    from: baseDataset[0].date,
    to: baseDataset[baseDataset.length - 1].date
  });

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const bhalswaMarkerRef = useRef(null);

  const smallChartCanvasRef = useRef(null);
  const largeChartCanvasRef = useRef(null);
  const smallChartRef = useRef(null);
  const largeChartRef = useRef(null);

  const selectedDay =
    baseDataset.find((d) => d.date === selectedDate) || baseDataset[0];
  const riskMeta = getRiskMeta(selectedDay);

  /* -------------------------------
       INIT LEAFLET MAP
  --------------------------------- */

  useEffect(() => {
    if (!mapRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
      bhalswaMarkerRef.current = null;
    }

    const map = L.map(mapRef.current, {
      scrollWheelZoom: true
    });

    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);

    const delhiAreas = [
      { name: "Bhalswa Landfill", coords: [28.735, 77.17], type: "critical" },
      { name: "Okhla Landfill", coords: [28.5329, 77.2812], type: "critical" },
      { name: "Ghazipur Landfill", coords: [28.6208, 77.3307], type: "critical" },
      { name: "Narela-Bawana Landfill", coords: [28.8515, 77.0722], type: "critical" },
      { name: "Tikri Kalan", coords: [28.6756, 76.9366], type: "critical" },
      { name: "Mundka", coords: [28.6833, 77.0177], type: "critical" },
      { name: "Najafgarh", coords: [28.6096, 76.9798], type: "critical" },
      { name: "Timarpur", coords: [28.7211, 77.2105], type: "critical" },
      { name: "Bahadurgarh", coords: [28.6781, 76.9254], type: "critical" },
      { name: "Bhiwani", coords: [28.793, 76.1392], type: "critical" },
      { name: "Rohtak", coords: [28.8955, 76.6066], type: "critical" },
      { name: "Ghaziabad", coords: [28.6692, 77.4538], type: "critical" },
      { name: "Meerut", coords: [28.9845, 77.7064], type: "critical" },
      { name: "Hapur", coords: [28.7306, 77.7759], type: "critical" },
      { name: "Garhmuktesar", coords: [28.7975, 78.1021], type: "critical" },
      { name: "Gajraula", coords: [28.8456, 78.2396], type: "critical" },
      // moderate
      { name: "Modinagar", coords: [28.8319, 77.577], type: "moderate" },
      { name: "Pilkhuwa", coords: [28.7136, 77.6546], type: "moderate" },
      { name: "Siyana", coords: [28.6272, 78.0642], type: "moderate" },
      { name: "Amroha", coords: [28.9031, 78.4698], type: "moderate" },
      { name: "Tosham", coords: [28.8697, 75.9167], type: "moderate" },
      { name: "Charkhi Dadri", coords: [28.5921, 76.2704], type: "moderate" },
      { name: "Loharu", coords: [28.4292, 75.8136], type: "moderate" },
      { name: "Baghpat", coords: [28.944, 77.2186], type: "moderate" },
      { name: "Sonipat", coords: [28.9959, 77.0117], type: "moderate" },
      { name: "Kharkhoda", coords: [28.8882, 76.8147], type: "moderate" },
      { name: "Sampla", coords: [28.8516, 76.7846], type: "moderate" },
      { name: "Chhara", coords: [28.8032, 76.6247], type: "moderate" },
      { name: "Jhajjar", coords: [28.6063, 76.6566], type: "moderate" },
      { name: "Matenhail", coords: [28.6072, 76.3847], type: "moderate" },
      { name: "Beri", coords: [28.7072, 76.5786], type: "moderate" },
      { name: "Bawani Khera", coords: [28.7056, 76.1322], type: "moderate" },
      // neutral Delhi localities
      { name: "Rohini", coords: [28.743, 77.067] },
      { name: "Pitampura", coords: [28.698, 77.131] },
      { name: "Connaught Place", coords: [28.6315, 77.2167] },
      { name: "Dwarka", coords: [28.5921, 77.046] },
      { name: "Saket", coords: [28.5245, 77.2066] },
      { name: "Mayur Vihar", coords: [28.6038, 77.3024] }
    ];

    const fg = L.featureGroup().addTo(map);

    delhiAreas.forEach((area) => {
      let markerStyle;
      if (area.type === "critical") {
        markerStyle = {
          radius: 10,
          weight: 2,
          color: "#b71c1c",
          fillColor: "#e53935",
          fillOpacity: 0.8
        };
      } else if (area.type === "moderate") {
        markerStyle = {
          radius: 9,
          weight: 2,
          color: "#b59f00",
          fillColor: "#ffe066",
          fillOpacity: 0.8
        };
      } else {
        markerStyle = {
          radius: 6,
          weight: 1,
          color: "#1d4ed8",
          fillColor: "#93c5fd",
          fillOpacity: 0.7
        };
      }
      const marker = L.circleMarker(area.coords, markerStyle).addTo(fg);

      marker.bindTooltip(area.name, {
        direction: "top",
        offset: [0, -4]
      });

      if (area.name === "Bhalswa Landfill") {
        bhalswaMarkerRef.current = marker;
        marker.bindPopup(`
          <strong>Bhalswa Landfill</strong><br/>
          Date: ${selectedDay.date}<br/>
          PM2.5: ${selectedDay.pm} µg/m³<br/>
          Temp: ${selectedDay.temp} °C<br/>
          Health Score: ${selectedDay.healthScore}
        `);
      }
    });

    map.fitBounds(fg.getBounds().pad(0.2));

    const heatPoints = baseDataset
      .filter((d) => d.viirs > 0)
      .map((d) => [
        28.735 + (Math.random() - 0.5) * 0.03,
        77.17 + (Math.random() - 0.5) * 0.04,
        d.viirs
      ]);

    L.heatLayer(heatPoints, { radius: 28, blur: 22 }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      bhalswaMarkerRef.current = null;
    };
  }, []);

  // update popup when date changes
  useEffect(() => {
    if (!bhalswaMarkerRef.current) return;

    const d =
      baseDataset.find((x) => x.date === selectedDate) || baseDataset[0];

    bhalswaMarkerRef.current.bindPopup(`
      <strong>Bhalswa Landfill</strong><br/>
      Date: ${d.date}<br/>
      PM2.5: ${d.pm} µg/m³<br/>
      Temp: ${d.temp} °C<br/>
      Health Score: ${d.healthScore}
    `);
  }, [selectedDate]);

  /* -------------------------------
       CHART CONFIG HELPER
  --------------------------------- */

  const buildChartConfig = () => ({
    type: "line",
    data: {
      labels: baseDataset.map((d) => d.date),
      datasets: [
        {
          label: "PM2.5 (µg/m³)",
          data: baseDataset.map((d) => d.pm),
          borderColor: "#c62828",
          tension: 0.2
        },
        {
          label: "Temp (°C)",
          data: baseDataset.map((d) => d.temp),
          borderColor: "#ff9800",
          tension: 0.2,
          yAxisID: "y1"
        },
        {
          label: "VIIRS hotspots",
          data: baseDataset.map((d) => d.viirs),
          borderColor: "#6a1b9a",
          tension: 0.2
        },
        {
          label: "Health Score",
          data: baseDataset.map((d) => d.healthScore),
          borderColor: "#2e7d32",
          tension: 0.2
        },
        {
          label: "Plastic mass (t)",
          data: baseDataset.map((d) => d.plastic),
          borderColor: "#0277bd",
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom" }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: { display: true, text: "PM / VIIRS / Scores / Plastic" }
        },
        y1: {
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "Temperature (°C)" }
        }
      }
    }
  });

  /* -------------------------------
       SMALL CHART (compact)
  --------------------------------- */

  useEffect(() => {
    if (!smallChartCanvasRef.current) return;

    if (smallChartRef.current) {
      smallChartRef.current.destroy();
    }

    const ctx = smallChartCanvasRef.current.getContext("2d");
    smallChartRef.current = new Chart(ctx, buildChartConfig());

    return () => {
      if (smallChartRef.current) {
        smallChartRef.current.destroy();
        smallChartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------
       LARGE CHART (overlay)
  --------------------------------- */

  useEffect(() => {
    if (!enlargeChart) {
      if (largeChartRef.current) {
        largeChartRef.current.destroy();
        largeChartRef.current = null;
      }
      return;
    }

    if (!largeChartCanvasRef.current) return;

    if (largeChartRef.current) {
      largeChartRef.current.destroy();
      largeChartRef.current = null;
    }

    const ctx = largeChartCanvasRef.current.getContext("2d");
    largeChartRef.current = new Chart(ctx, buildChartConfig());

    return () => {
      if (largeChartRef.current) {
        largeChartRef.current.destroy();
        largeChartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enlargeChart]);

  /* -------------------------------
       CSV EXPORT
  --------------------------------- */

  const downloadCSV = () => {
    const headers = [
      "date",
      "temp",
      "viirs",
      "pm",
      "plastic",
      "gt",
      "workerVuln",
      "healthScore",
      "plasticScore",
      "combined"
    ];
    const rows = baseDataset.map((d) =>
      [
        d.date,
        d.temp,
        d.viirs,
        d.pm,
        d.plastic,
        d.gt,
        d.workerVuln,
        d.healthScore,
        d.plasticScore,
        d.combined
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ecosynergy_bhalswa_demo.csv";
    a.click();
  };

  const recommendations = generateRecommendations(selectedDay);

  /* -------------------------------
       COMPONENT JSX
  --------------------------------- */

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Inter, sans-serif",
        background: "#f3f6fb",
        overflowX: "hidden",
        position: "relative"
      }}
    >
      <style>{`
        .card { background:#ffffff; padding:12px; border-radius:12px; box-shadow:0 6px 20px rgba(15,23,42,0.08); }
        .table { width:100%; font-size:13px; border-collapse:collapse; }
        .table td, .table th { padding:6px; border-bottom:1px solid #f0f3f7; }
        .table tr:hover { background:#f5f5ff; }
        button { padding:6px 10px; border-radius:999px; border:none; background:#2563eb; color:white; font-size:13px; cursor:pointer; }
        .search-btn { padding:6px 16px; border-radius:8px; background:#2563eb; color:white; font-weight:600; font-size:14px; border:none; margin-left:8px; cursor:pointer; transition:background 0.2s; }
        .search-btn:hover { background:#1d4ed8; }
        .nav-btn { padding:6px 14px; border-radius:999px; background:#0f172a; color:#e5e7eb; font-size:12px; font-weight:600; border:1px solid #1e293b; display:inline-flex; align-items:center; gap:6px; }
        .nav-btn:hover { background:#020617; }
        @media (max-width: 900px) {
          .layout-grid { grid-template-columns: 1fr !important; }
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
        }
        .badge {
          display:inline-block;
          padding:3px 10px;
          border-radius:999px;
          font-size:11px;
          font-weight:600;
          margin-bottom:4px;
        }
        .badge-severe {
          background:#fee2e2;
          color:#b91c1c;
          border:1px solid #fecaca;
        }
        .badge-high {
          background:#fef3c7;
          color:#b45309;
          border:1px solid:#fde68a;
        }
        .badge-moderate {
          background:#e0f2fe;
          color:#0369a1;
          border:1px solid #bae6fd;
        }
        .badge-low {
          background:#ecfdf3;
          color:#15803d;
          border:1px solid #bbf7d0;
        }
        .badge-phase {
          background:#eef2ff;
          color:#3730a3;
          border-color:#e0e7ff;
        }
        .subcaption {
          font-size:11px;
          color:#64748b;
          margin-top:2px;
        }
        .date-selector {
          margin-top:8px;
          padding:6px 8px;
          background:#f8fafc;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
        }
        .date-selector-label {
          font-size:11px;
          font-weight:600;
          color:#475569;
          white-space:nowrap;
        }
        .date-selector input[type="date"] {
          flex:1;
          padding:4px 8px;
          border-radius:8px;
          border:1px solid #e2e8f0;
          font-size:12px;
          color:#0f172a;
          background:#ffffff;
        }
      `}</style>

      {/* TOP-RIGHT NAV BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 8
        }}
      >
        <button
          className="nav-btn"
          onClick={() => window.history.back()}
          // if you have routing: replace above with e.g. window.location.href = "/dashboard"
        >
          ← Back to dashboard
        </button>
      </div>

      <h1
        style={{
          marginBottom: 8,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: "1px",
          color: "#b71c1c",
          textShadow: "0 2px 12px #fbbf24, 0 1px 0 #fff",
          borderBottom: "3px solid #e53935",
          paddingBottom: 8
        }}
      >
        Bhalswa LandFill Incident Fire - 2022
      </h1>
      <p
        style={{
          marginTop: 0,
          color: "#b71c1c",
          fontSize: 16,
          textAlign: "center",
          fontWeight: 500,
          fontStyle: "italic",
          marginBottom: 10
        }}
      >
        Major landfill fire event in Delhi. Data and map for awareness and analysis.
      </p>

      {/* FULL-WIDTH MAP */}
      <div
        className="card"
        style={{
          marginTop: 10,
          marginLeft: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          padding: 16
        }}
      >
        <strong>Map - Delhi &amp; its neighbourhood</strong>
        <p style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
          Delhi overview on load – zoom &amp; pan to explore Bhalswa, Okhla, Ghazipur and nearby areas.
        </p>
        <div
          ref={mapRef}
          style={{
            marginTop: 8,
            height: 450,
            borderRadius: 12,
            overflow: "hidden"
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 12,
            marginLeft: 8
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 16,
                height: 16,
                background: "#e53935",
                borderRadius: "50%",
                display: "inline-block",
                border: "2px solid #b71c1c"
              }}
            ></span>
            <span
              style={{
                fontWeight: 600,
                color: "#b71c1c",
                fontSize: 14
              }}
            >
              Critical risk
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 16,
                height: 16,
                background: "#ffe066",
                borderRadius: "50%",
                display: "inline-block",
                border: "2px solid #b59f00"
              }}
            ></span>
            <span
              style={{
                fontWeight: 600,
                color: "#b59f00",
                fontSize: 14
              }}
            >
              Moderate risk
            </span>
          </div>
        </div>
      </div>

      {/* REST OF DASHBOARD */}
      <div
        className="layout-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: 14,
          marginTop: 16
        }}
      >
        {/* LEFT PANEL */}
        <div>
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8
              }}
            >
              <div>
                <strong>Automated Recommendations</strong>
                <div className="subcaption">
                  Based on plastic load, fire hotspots &amp; health impact.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className={`badge ${riskMeta.className}`}>
                  {riskMeta.label}
                </div>
                <div className="badge badge-phase">{riskMeta.phase}</div>
              </div>
            </div>

            {/* DATE SELECTION TAB */}
            <div className="date-selector">
              <span className="date-selector-label">Scenario date</span>
              <input
                type="date"
                value={selectedDate}
                min={baseDataset[0].date}
                max={baseDataset[baseDataset.length - 1].date}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 8 }}>
              {recommendations.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: 8,
                    background: "#fff7f0",
                    borderLeft: "4px solid #f97316",
                    padding: "8px 10px",
                    borderRadius: 8
                  }}
                  dangerouslySetInnerHTML={{ __html: r }}
                />
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <strong>Data Actions</strong>
            <div style={{ marginTop: 8 }}>
              <button onClick={downloadCSV}>Download CSV</button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div>
          {/* COMPACT CHART */}
          <div className="card" style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <strong>Time Series</strong>
              <button
                className="search-btn"
                style={{
                  fontSize: 16,
                  padding: "2px 12px",
                  borderRadius: 6,
                  background: "#6366f1",
                  marginLeft: 8
                }}
                title="Enlarge graph"
                onClick={() => setEnlargeChart(true)}
              >
                Enlarged View⬈
              </button>
            </div>
            <div style={{ marginTop: 8, height: 240 }}>
              <canvas
                ref={smallChartCanvasRef}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* ENLARGED OVERLAY */}
          {enlargeChart && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(30,41,59,0.85)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => setEnlargeChart(false)}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  padding: 32,
                  position: "relative",
                  minWidth: 420,
                  minHeight: 420,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    fontSize: 22,
                    background: "none",
                    border: "none",
                    color: "#334155",
                    cursor: "pointer"
                  }}
                  title="Close"
                  onClick={() => setEnlargeChart(false)}
                >
                  ×
                </button>
                <div
                  style={{
                    width: "80vw",
                    height: "70vh",
                    maxWidth: 1200,
                    maxHeight: 700
                  }}
                >
                  <canvas
                    ref={largeChartCanvasRef}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* EVENT TABLE */}
          <div className="card" style={{ marginTop: 12 }}>
            <strong>Event Data</strong>
            <div
              style={{
                margin: "10px 0 16px 0",
                display: "flex",
                gap: 16,
                alignItems: "center"
              }}
            >
              <label style={{ fontWeight: 500, fontSize: 13 }}>
                From:
                <input
                  type="date"
                  value={filterFrom}
                  min={baseDataset[0].date}
                  max={filterTo}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  style={{
                    marginLeft: 6,
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid #ddd"
                  }}
                />
              </label>
              <label style={{ fontWeight: 500, fontSize: 13 }}>
                To:
                <input
                  type="date"
                  value={filterTo}
                  min={filterFrom}
                  max={baseDataset[baseDataset.length - 1].date}
                  onChange={(e) => setFilterTo(e.target.value)}
                  style={{
                    marginLeft: 6,
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid #ddd"
                  }}
                />
              </label>
              <button
                className="search-btn"
                onClick={() =>
                  setFilterRange({ from: filterFrom, to: filterTo })
                }
              >
                Search
              </button>
            </div>
            <div style={{ maxHeight: 230, overflowY: "auto", marginTop: 6 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Temp</th>
                    <th>VIIRS</th>
                    <th>PM2.5</th>
                    <th>Plastic</th>
                    <th>GT</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {baseDataset
                    .filter(
                      (d) =>
                        d.date >= filterRange.from && d.date <= filterRange.to
                    )
                    .map((d) => (
                      <tr
                        key={d.date}
                        style={{
                          cursor: "pointer",
                          background:
                            d.date === selectedDay.date ? "#eef2ff" : ""
                        }}
                        onClick={() => setSelectedDate(d.date)}
                      >
                        <td>{d.date}</td>
                        <td>{d.temp}</td>
                        <td>{d.viirs}</td>
                        <td>{d.pm}</td>
                        <td>{d.plastic}</td>
                        <td>{d.gt}</td>
                        <td>{d.healthScore}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
