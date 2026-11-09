// Runs Python code in a Web Worker so infinite loops never freeze the page.
// The main thread terminates this worker when a run exceeds its time limit.
importScripts('https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.js');

const pyodideReady = loadPyodide();

const RUNNER = `
import builtins, sys, io, traceback

def _run(code, inputs, echo, check):
    out = io.StringIO()
    old_stdout, old_stderr = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    queue = list(inputs)

    def fake_input(prompt=""):
        if not queue:
            raise EOFError("Faltan datos: agrega mas lineas en 'Entradas para input()'.")
        value = queue.pop(0)
        if echo:
            print(f"{prompt}{value}")
        return value

    ns = {"__name__": "__main__", "input": fake_input}
    error = None
    try:
        exec(compile(code, "<tu codigo>", "exec"), ns)
        if check:
            ns["_stdout"] = out.getvalue()
            exec(compile(check, "<autograder>", "exec"), ns)
    except AssertionError as e:
        error = "Prueba fallida: " + (str(e) or "una condicion no se cumplio")
    except BaseException:
        lines = traceback.format_exc().splitlines()
        # Hide runner frames; keep only the student's part of the traceback.
        keep = [l for l in lines if "_run" not in l and "exec(compile" not in l]
        error = "\\n".join(keep)
    finally:
        sys.stdout, sys.stderr = old_stdout, old_stderr
    return out.getvalue(), error
`;

let runFn = null;

self.onmessage = async (event) => {
  const { id, code, inputs, echo, check } = event.data;
  try {
    const pyodide = await pyodideReady;
    if (!runFn) {
      pyodide.runPython(RUNNER);
      runFn = pyodide.globals.get('_run');
    }
    const result = runFn(code, pyodide.toPy(inputs), echo, check || '');
    const [output, error] = result.toJs();
    result.destroy();
    self.postMessage({ id, output, error });
  } catch (err) {
    self.postMessage({ id, output: '', error: String(err) });
  }
};

self.postMessage({ ready: false });
pyodideReady.then(() => self.postMessage({ ready: true }));
