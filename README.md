# Os-s (Open Source Sculpt)

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Os-s Interface Screenshot](https://github.com/user-attachments/assets/1a35d9f2-05aa-4342-8832-00fdbd13c0db)




## Overview

Os-s is a high-performance, web-based 3D sculpting application designed to provide professional-grade modeling tools directly within the browser. Built on React and Three.js, the application leverages direct buffer attribute manipulation to enable real-time mesh deformation and vertex painting on high-resolution geometry. It serves as a lightweight, accessible alternative to desktop sculpting software, focusing on essential workflows for concepting and organic modeling.

## Key Features

### Sculpting Engine

The core interaction layer is built upon a custom deformation engine that manipulates geometry buffers in real-time.

*   **Standard Brush:** Displaces geometry along vertex normals to add volume and form.
*   **Smooth:** Applies Laplacian smoothing algorithms to average vertex positions, effectively denoising surface irregularities and relaxing topology.
*   **Flatten:** Calculates the average plane of the selection area and projects vertices onto it, essential for hard-surface modeling and planing.
*   **Pinch:** Pulls vertices toward the brush center to sharpen edges and create distinct crease lines.
*   **Vertex Painting:** Features a cubic-falloff airbrush system for applying vertex colors with smooth gradients, opacity layering, and high-fidelity blending.

### Workflow Tools

*   **History System:** A comprehensive Undo/Redo stack that captures snapshots of both geometry positions and vertex color buffers, ensuring data integrity during the creative process.
*   **OBJ Export:** Native generation of Wavefront `.obj` files, allowing for seamless interoperability with industry-standard software such as Blender, Maya, and ZBrush.
*   **Material Simulation:** Real-time shading switching between Standard, Clay (high roughness), and Metallic (high specularity) materials to visualize surface details under different lighting conditions.
*   **Visualization:** Toggleable wireframe overlays and global mesh tinting for topology inspection.

## Technical Architecture

### Technology Stack

*   **Frontend Framework:** React 19 (TypeScript)
*   **Build Tool:** Vite
*   **3D Graphics Engine:** Three.js
*   **React Integration:** React Three Fiber / @react-three/drei
*   **Styling:** Tailwind CSS

### Implementation Details

*   **Direct Buffer Manipulation:** To achieve 60 FPS performance during complex deformation calculations, sculpting logic operates directly on the `Float32Array` buffers (`attributes.position` and `attributes.color`). This bypasses the overhead of high-level object abstraction layers during the render loop.
*   **Memory Management:** The application utilizes rigorous memory management strategies, including optimized vector math to minimize garbage collection during high-frequency pointer events.
*   **State Architecture:** React state manages the UI and tool configuration, while mutable Refs are utilized for render-loop data and history stacks to decouple rendering performance from the React reconciliation cycle.

## Installation and Development

### Prerequisites

*   **Node.js** (Version 18 or higher recommended)
*   **npm** (Node Package Manager)

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/dovvnloading/Os-Sculpt.git
    cd Os-Sculpt
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The application will launch at `http://localhost:5173` (default Vite port).

4.  **Build for Production**
    ```bash
    npm run build
    ```

## Usage Guide

### Navigation

| Action | Control |
| :--- | :--- |
| **Rotate Camera** | Left Click + Drag (on background) |
| **Pan Camera** | Right Click + Drag |
| **Zoom** | Mouse Scroll Wheel |

### Sculpting

1.  Select a tool (**Standard**, **Smooth**, **Flatten**, **Pinch**) from the left sidebar.
2.  Adjust **Radius** and **Intensity** in the right Properties Panel.
3.  **Left Click + Drag** on the mesh surface to apply the deformation.

### Painting

1.  Select the **Paint** tool from the sidebar.
2.  Select a color from the "Paint Color" palette in the Properties Panel.
3.  The tool operates as an airbrush; repeated strokes increase opacity.

### File Management

*   **Export:** Click the **EXP** button in the top toolbar to generate and download a `.obj` file of the current mesh.

