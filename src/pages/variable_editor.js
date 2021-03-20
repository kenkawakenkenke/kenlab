
// Comments
// 
// Use already known primes
// Up to sqrt
// 
// import { EditorView } from "@codemirror/next/view";
// import { EditorState } from "@codemirror/next/state";
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';

function isPrime(number) {
    for (let i = 2; i < number; i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

function primesUpTo(number) {
    const primes = [];
    for (let i = 2; i < number; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    return primes;
}
console.log(primesUpTo(100));

function CodeDifficultyPage() {
    const code = "function foo() {};\nf();"
    return <div>
        hey
      <CodeMirror
            value={code}
            options={{
                theme: 'monokai',
                keyMap: 'sublime',
                mode: 'js',
            }}
        />
                yo
    </div>
}
CodeDifficultyPage.title = "コードの難しさ";
CodeDifficultyPage.path = "variable_ide";
export default CodeDifficultyPage;