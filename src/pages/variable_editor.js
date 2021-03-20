
// Comments
// 
// Use already known primes
// Up to sqrt
// 
// import { EditorView } from "@codemirror/next/view";
// import { EditorState } from "@codemirror/next/state";
import { Slider } from '@material-ui/core';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import { useState } from 'react';

const codeLevels = [
    {
        title: "simplest",
        f: () => {
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
            return primesUpTo(200).join(" ");
        }
    },
    {
        title: "use known primes",
        f: () => {
            function isPrime(number, knownPrimes) {
                for (let i = 0; i < knownPrimes.length; i++) {
                    if (number % knownPrimes[i] === 0) {
                        return false;
                    }
                }
                return true;
            }

            function primesUpTo(number) {
                const primes = [];
                for (let i = 2; i < number; i++) {
                    if (isPrime(i, primes)) {
                        primes.push(i);
                    }
                }
                return primes;
            }
            return primesUpTo(200).join(" ");
        }
    },
    {
        title: "up for of",
        f: () => {
            function isPrime(number, knownPrimes) {
                for (const prime of knownPrimes) {
                    if (number % prime === 0) {
                        return false;
                    }
                }
                return true;
            }

            function primesUpTo(number) {
                const primes = [];
                for (let i = 2; i < number; i++) {
                    if (isPrime(i, primes)) {
                        primes.push(i);
                    }
                }
                return primes;
            }
            return primesUpTo(200).join(" ");
        }
    },
    {
        title: "up to sqrt",
        f: () => {
            function isPrime(number, knownPrimes) {
                const max = Math.sqrt(number);
                for (const prime of knownPrimes) {
                    if (prime > max) {
                        return true;
                    }
                    if (number % prime === 0) {
                        return false;
                    }
                }
                return true;
            }

            function primesUpTo(number) {
                const primes = [];
                for (let i = 2; i < number; i++) {
                    if (isPrime(i, primes)) {
                        primes.push(i);
                    }
                }
                return primes;
            }
            return primesUpTo(200).join(" ");
        }
    },
    {
        title: "use stream",
        f: () => {
            function isPrime(number, knownPrimes) {
                const max = Math.sqrt(number);
                return knownPrimes
                    .filter(prime => prime <= max)
                    .every(prime => (number % prime) !== 0);
            }

            function primesUpTo(number) {
                const primes = [];
                for (let i = 2; i < number; i++) {
                    if (isPrime(i, primes)) {
                        primes.push(i);
                    }
                }
                return primes;
            }
            return primesUpTo(200).join(" ");
        }
    }
];

function CodeDifficultyPage() {
    function formatCodeblock(func) {
        const lines = func.toString().split("\n");
        return lines.slice(1, lines.length - 1).join("\n");
    }

    const [codeLevel, setCodeLevel] = useState(1);

    const code = `${formatCodeblock(codeLevels[codeLevel].f)}`;
    return <div>
        <Slider
            min={0}
            max={codeLevels.length - 1}
            value={codeLevel}
            onChange={(e, newValue) => setCodeLevel(newValue)}
        />
        <hr />
        <CodeMirror
            value={code}
            options={{
                theme: 'monokai',
                keyMap: 'sublime',
                mode: 'js',
            }}
        />
        {codeLevels[codeLevel].f()}
    </div>
}
CodeDifficultyPage.title = "コードの難しさ";
CodeDifficultyPage.path = "variable_ide";
export default CodeDifficultyPage;