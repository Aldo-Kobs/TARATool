# Distributing this modified TARA Tool

Updated 17 September 2026. This guide explains how to package this fork with its notices and source. The governing terms are in [LICENSE](../LICENSE); this guide adds no license conditions. Attribution and modification dates are in [NOTICE.md](../NOTICE.md) and [MODIFICATIONS.md](MODIFICATIONS.md).

## License scope

The upstream project grants GPL version 3 or any later version, and this fork preserves that grant (SPDX: **GPL-3.0-or-later**). The grant covers the modified program as a whole and its accompanying project documentation, subject to separately licensed third-party material. Do not replace upstream notices with the fork author's credit. The Free Software Foundation's copyright on the GPL text is separate from the program authors' copyrights.

Private modification alone does not require public release. Obligations to supply source depend on conveying copies. Serving this client-side application's JavaScript to browsers transfers copies, so a hosted release must also carry the relevant license and modification notices. Ordinary interaction with a server without receiving a copy is a different case under GPLv3 section 0.

## Source releases and hosted copies

For this repository's unbundled browser application:

1. Include the complete source for the version supplied: `index.html`, `js/`, `css/`, `config/`, and the relevant documentation and scripts. A full repository source archive is the simplest starting point. Retain package manifests, lockfiles and any scripts needed to generate, install, run or modify the distributed version.
2. Include `LICENSE`, `NOTICE.md`, `docs/MODIFICATIONS.md` and the existing copyright and third-party notices. Keep the About dialog's legal notices and its links accessible in hosted and offline copies. Markdown/PDF guides should travel with the license and attribution notices.
3. Distribute the covered work under GPL-3.0-or-later, preserve the warranty disclaimer, and do not impose additional restrictions on recipients' GPL rights.
4. Identify the exact release revision and document new modifications with a relevant date. The source must match the copy supplied; an upstream URL or a link to the latest moving branch is not a substitute for missing source for that version.

The application is run by opening `index.html` in a modern browser; no application build is required. After editing the assessment JSON, `python3 scripts/sync_assessment_config.py` regenerates its JavaScript counterpart. See the [README](../README.md), [user guide](user-guide.md) and [script documentation](../scripts/README.md) for operation and maintenance.

## Minified, bundled, executable or device releases

If distributing a non-source form, apply GPLv3 section 6. A straightforward download arrangement under section 6(d) provides the complete corresponding source for that exact version from the same place, with equivalent access and no additional charge. Put clear source-download directions beside the non-source download. Include the preferred editable source and scripts needed to generate, install, run and modify it; supply source for required covered components as applicable to that release. System Libraries and the other exclusions in section 1 are treated as specified by the license.

A general link to this fork is not a written source offer and does not by itself satisfy all section 6 distribution methods. If choosing another method, meet that method's actual conditions. If distributing in or with a “User Product” under section 6, provide Installation Information when that section requires it, so recipients can install and execute modified versions.

## Third-party components

The current application references Font Awesome Free, HPCC's Graphviz/WASM package, JSZip and jsPDF through CDNs. Their own licensing remains applicable. Preserve dependency license headers and notices; when bundling or self-hosting dependencies, include the license texts, attributions and source or other materials their licenses require for the versions actually shipped. Check transitive and embedded components as well as top-level packages. The application's SBOM is an inventory aid, not a substitute for license texts or a complete dependency-license audit. Development dependencies retain their individual licenses in the lockfile.

## License references

- [GPLv3 sections 0, 1, 4, 5 and 6](https://www.gnu.org/licenses/gpl-3.0.html): legal notices, source definitions, distribution and modified versions. The same text is included locally in [LICENSE](../LICENSE).
- [GNU GPL FAQ: private modifications and publication](https://www.gnu.org/licenses/gpl-faq.html#GPLRequireSourcePostedPublic).
