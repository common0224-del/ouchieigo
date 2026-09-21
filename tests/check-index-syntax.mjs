import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export function checkIndexSyntax(htmlPath=path.resolve('index.html')) {
  const html=fs.readFileSync(htmlPath,'utf8');
  const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  if(!scripts.length) throw new Error(`${htmlPath}: inline JavaScript was not found`);

  const functionDeclarations=new Map();
  for(const script of scripts) {
    const code=script[1];
    const codeOffset=script.index+script[0].indexOf('>')+1;
    const firstLine=html.slice(0,codeOffset).split('\n').length;
    try {
      // Padding makes vm.Script report the actual index.html line number.
      new vm.Script('\n'.repeat(firstLine-1)+code,{filename:htmlPath});
    } catch(error) {
      throw new Error(`index.html の JavaScript 構文エラー（HTML ${firstLine}行目以降）\n${error.stack}`);
    }
    for(const match of code.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
      const line=firstLine+code.slice(0,match.index).split('\n').length-1;
      const earlier=functionDeclarations.get(match[1]);
      if(earlier) throw new Error(`index.html:${line}: 関数 ${match[1]} が重複定義されています（最初は${earlier}行目）`);
      functionDeclarations.set(match[1],line);
    }
  }

  const style=html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i)?.[1] || '';
  const debugSelectors=new Set();
  for(const match of style.matchAll(/(\.speech-debug(?:-[\w-]+)?(?:\s+button)?)\s*\{/g)) {
    if(debugSelectors.has(match[1])) throw new Error(`index.html: CSS ${match[1]} が重複定義されています`);
    debugSelectors.add(match[1]);
  }
  return {scripts:scripts.length,functions:functionDeclarations.size,debugSelectors:debugSelectors.size};
}

if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)) {
  try {
    const result=checkIndexSyntax();
    console.log(`構文チェック PASS: index.html のスクリプト ${result.scripts}件、関数 ${result.functions}件、.speech-debug 系 CSS ${result.debugSelectors}件。重複なし。`);
  } catch(error) {
    console.error(error.message);
    process.exitCode=1;
  }
}
