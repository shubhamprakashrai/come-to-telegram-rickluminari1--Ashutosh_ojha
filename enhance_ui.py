import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Make sections transparent to show 3D background
content = content.replace('bg-gray-50', 'bg-transparent text-white')
content = content.replace('bg-white', 'bg-transparent text-white')
content = content.replace('bg-slate-50', 'bg-transparent text-white')

# Fix text colors for dark mode
content = content.replace('text-slate-900', 'text-white')
content = content.replace('text-gray-800', 'text-gray-200')
content = content.replace('text-gray-700', 'text-gray-300')
content = content.replace('text-gray-600', 'text-gray-400')
content = content.replace('border-gray-200', 'border-white/10')
content = content.replace('border-gray-100', 'border-white/10')

# Upgrade cards to glassmorphism
content = content.replace('bg-white p-8 rounded-2xl shadow-lg border border-gray-100', 'bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10')
content = content.replace('bg-white p-6 rounded-2xl shadow-md border border-gray-100', 'bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-md border border-white/10 hover:bg-white/10 transition-colors duration-300')

# Upgrade badges
content = content.replace('bg-amber-100 text-amber-800', 'bg-amber-500/20 text-amber-400 border border-amber-500/30')

# Fix disclaimer text which should stay light because its background is white!
# Wait, the disclaimer modal uses `bg-white rounded-2xl`. We replaced `bg-white` globally!
# Let's fix the disclaimer modal specifically.
content = content.replace('className="bg-transparent text-white rounded-2xl shadow-2xl max-w-3xl', 'className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl')
content = content.replace('className="flex-1 overflow-y-auto px-6 py-6 space-y-5 text-gray-300"', 'className="flex-1 overflow-y-auto px-6 py-6 space-y-5 text-gray-300"')
content = content.replace('className="bg-transparent text-white px-6 py-4 border-t border-white/10"', 'className="bg-slate-900 px-6 py-4 border-t border-slate-800"')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
