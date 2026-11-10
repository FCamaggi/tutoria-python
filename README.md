# Guía Interactiva Python

Sitio de estudio para pruebas de introducción a la programación en Python: teoría breve, preguntas "cazabobos", visualizaciones paso a paso (Python Tutor) y ejercicios con corrección automática que corren en el navegador (Pyodide).

Construido con [Astro Starlight](https://starlight.astro.build). Se publica en Netlify en cada push a `main`.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Dónde está cada cosa

| Ruta | Contenido |
| --- | --- |
| `src/content/docs/*.mdx` | Los módulos (una página por archivo) |
| `astro.config.mjs` | Orden de la barra lateral |
| `src/components/PythonRunner.astro` | Editor + autograder |
| `src/components/Quiz.astro` | Pregunta de alternativas con explicación |
| `src/components/PythonTutor.astro` | Visualización paso a paso |
| `public/pyodide-worker.js` | Ejecuta Python en un Web Worker con límite de tiempo |

## Agregar contenido

Ejercicio con corrección automática (cada caso compara la salida exacta):

```mdx
<PythonRunner
	id="identificador-unico"
	initialCode={`n = int(input())`}
	tests={[{ inputs: '5', expected: '25' }]}
	hint="Pista opcional"
/>
```

Con `testCode` se pueden agregar comprobaciones extra (se ejecutan en el mismo espacio de nombres del alumno, con las entradas por defecto). Dispone de `_stdout` (lo que imprimió) y `_source` (el código como texto), útil para exigir o prohibir un tipo de ciclo:

```mdx
<PythonRunner
	id="reescribe-con-while"
	initialCode={`for i in range(3):
    print(i)`}
	tests={[{ expected: '0\n1\n2' }]}
	testCode={`import ast
assert not any(isinstance(n, ast.For) for n in ast.walk(ast.parse(_source))), "Usa while"`}
/>
```

Pregunta de alternativas:

```mdx
<Quiz
	code={`print(7 // 2)`}
	options={[
		{ text: '3', correct: true, explanation: 'Por qué es correcta.' },
		{ text: '3.5', explanation: 'Por qué es incorrecta.' },
	]}
/>
```

Visualización:

```mdx
<PythonTutor code={`x = 1
x += 1`} />
```

Cada `.mdx` que use componentes debe importarlos al inicio, por ejemplo `import Quiz from '../../components/Quiz.astro';`.
