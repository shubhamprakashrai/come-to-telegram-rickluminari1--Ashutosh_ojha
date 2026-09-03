import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

bad_form = content[content.find('<form className="space-y-6">'):content.find('</form>')+7]

good_form = """<form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 rounded-lg bg-slate-900/50 text-gray-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors backdrop-blur-sm">
                      <option value="">Your Query</option>
                      <option value="civil">Get Support</option>
                      <option value="corporate">Guidance</option>
                      <option value="documentation">Find Solutions</option>
                      <option value="consultation">Discuss Options</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="Describe your legal query in detail"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors backdrop-blur-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </button>

                <p className="text-sm text-gray-400 text-center">
                  All consultations are confidential and protected by attorney-client privilege.
                </p>
              </form>"""

content = content.replace(bad_form, good_form)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
