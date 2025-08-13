# 📝 Text List Manager

Una aplicación de gestión de listas de texto desarrollada como prueba técnica que demuestra arquitectura limpia, patrones de diseño modernos y buenas prácticas de desarrollo.

## 📋 Sobre el Versionado

> **📝 Nota: Prueba Técnica**
>
> Este proyecto no incluye versionado semántico ni changelog ya que es una demostración técnica. En un proyecto de producción implementaría el seguimiento de versiones completo, pero aquí me enfoqué en la funcionalidad y la calidad del código.
>
> **Resumen**: Prioridad en demostrar habilidades técnicas sobre procesos de versionado.

## 🎯 ¿Qué es?

Esta aplicación permite a los usuarios crear, gestionar y manipular una lista de elementos de texto con funcionalidades avanzadas como:

- ✅ **Añadir elementos** a la lista
- 🗑️ **Eliminar elementos** (individual o múltiples)
- 📋 **Seleccionar elementos** para operaciones en lote
- ↩️ **Sistema de Undo/Redo** completo
- 🎨 **Interfaz moderna** y responsive

## 🚀 Características Principales

### Gestión de Elementos

- **Añadir**: Modal con validación de formulario
- **Eliminar individual**: Doble clic en cualquier elemento
- **Eliminar múltiples**: Seleccionar elementos y usar botón DELETE
- **Selección**: Clic simple para alternar selección

### Sistema de Undo Avanzado

- **Deshacer añadir**: Revierte la última adición
- **Deshacer eliminar**: Restaura elementos eliminados
- **Deshacer eliminación múltiple**: Restaura todos los elementos eliminados en lote
- **Historial completo**: Mantiene todas las acciones para deshacer

### Interfaz de Usuario

- **Modal responsive** para añadir elementos
- **Validación en tiempo real** con mensajes de error
- **Estados de loading** durante operaciones
- **Feedback visual** para selecciones y acciones
- **Diseño moderno** con CSS Modules

## 🏗️ Arquitectura

### Domain-Driven Design (DDD)

```
src/
├── domain/           # Lógica de negocio pura
│   ├── models/       # Entidades del dominio
│   ├── services/     # Servicios de dominio
│   └── types.ts      # Tipos y interfaces
├── application/      # Casos de uso (futuro)
└── infrastructure/   # Implementaciones concretas
    └── ui/           # Componentes React
```

### Patrones Implementados

- **Clean Architecture**: Separación clara de responsabilidades
- **Repository Pattern**: Abstracción de acceso a datos
- **Command Pattern**: Sistema de undo/redo
- **Observer Pattern**: React hooks para estado
- **Factory Pattern**: Creación de entidades

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **Styling**: CSS Modules
- **State Management**: React Hooks (useState, useCallback)
- **Package Manager**: pnpm

## 📦 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd prueba-logi-travel

# Instalar dependencias
pnpm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Ejecutar tests
pnpm test

# Ejecutar tests con cobertura
pnpm test -- --coverage

# Build para producción
pnpm build
```

## 🧪 Testing

El proyecto incluye una suite completa de tests con **96% de cobertura**:

- ✅ **88 tests** pasando
- ✅ **9 suites** de test
- ✅ **Cobertura completa** de componentes críticos
- ✅ **Tests de integración** para hooks
- ✅ **Tests unitarios** para servicios de dominio

### Estructura de Tests

```
src/
├── domain/services/TextListService.test.ts
├── infrastructure/ui/
│   ├── App.test.tsx
│   └── components/
│       ├── Modal/Modal.test.tsx
│       └── TextList/
│           ├── TextList.test.tsx
│           ├── hooks/useTextList.test.ts
│           └── components/
│               ├── AddItemForm/AddItemForm.test.tsx
│               ├── List/List.test.tsx
│               ├── ListItem/ListItem.test.tsx
│               └── Toolbar/Toolbar.test.tsx
```

## 🎮 Cómo Usar la Aplicación

1. **Añadir Elementos**:

   - Haz clic en el botón "ADD"
   - Escribe el texto en el modal
   - Presiona "Add" o Enter

2. **Seleccionar Elementos**:

   - Haz clic simple en cualquier elemento
   - Los elementos seleccionados se resaltan en azul

3. **Eliminar Elementos**:

   - **Individual**: Doble clic en el elemento
   - **Múltiples**: Selecciona elementos y usa "DELETE"

4. **Deshacer Acciones**:
   - Usa el botón "↶" para deshacer la última acción
   - Funciona con añadir, eliminar individual y eliminar múltiples

## 🔧 Versiones Disponibles

### React + TypeScript (Principal)

- Arquitectura moderna con DDD
- Sistema de undo avanzado
- Tests completos
- TypeScript estricto

### Vanilla JavaScript

- Implementación en JavaScript puro
- Misma funcionalidad que la versión React
- Sin dependencias de framework

---
