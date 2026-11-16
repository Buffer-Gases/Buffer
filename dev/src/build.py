order=['c1','c2','c3','c4','c5','c6','c7','c8','c10','c11','c12','c9','e1','e2','ui1','ui2','ui5','ui3','ui6','ui7','e3','ui8','ui9','ui10','hub','kit']
js='\n'.join(open(f+'.js').read() for f in order)+'\nboot();hubBoot();\n'
out=open('shell.html').read().rstrip()+'\n<script>\n'+js+'</script>\n'
open('buffer.html','w').write(out)
print(len(out))
# fail loudly on syntax errors and duplicate top-level declarations
import subprocess,tempfile,os
tf=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False);tf.write(js);tf.close()
r=subprocess.run(['node','--check',tf.name],capture_output=True,text=True);os.unlink(tf.name)
if r.returncode:print('SYNTAX ERROR\n'+r.stderr[:800]);raise SystemExit(1)
# duplicate top-level function names silently override each other: fail on them
import re,collections
seen=collections.defaultdict(list)
for f in order:
  for m in re.finditer(r'^(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*))',open(f+'.js').read(),re.M):seen[m.group(1) or m.group(2)].append(f)
dups={k:v for k,v in seen.items() if len(v)>1}
if dups:print('DUPLICATE DECLARATIONS',dups);raise SystemExit(1)
