/**
 * .pnpmfile.cjs — pnpm install hook
 *
 * Removes @next/swc-* and @img/sharp-* from Next.js's optionalDependencies
 * before pnpm resolves them. This prevents the 47 MB SWC binary from being
 * downloaded. Next.js automatically falls back to Babel (configured in .babelrc).
 */

function readPackage(pkg) {
  if (pkg.name === 'next' && pkg.optionalDependencies) {
    for (const dep of Object.keys(pkg.optionalDependencies)) {
      if (dep.startsWith('@next/swc') || dep.startsWith('@img/sharp') || dep === 'sharp') {
        delete pkg.optionalDependencies[dep];
      }
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
