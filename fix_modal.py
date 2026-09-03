with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Fix the main disclaimer paragraph text color
content = content.replace('className="text-slate-800 leading-relaxed"', 'className="text-gray-300 leading-relaxed"')

# Fix the list item backgrounds and borders in the modal
content = content.replace('className="bg-transparent text-white rounded-xl p-4 border-l-4 border-amber-500"', 'className="bg-white/5 rounded-xl p-4 border-l-4 border-amber-500"')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
