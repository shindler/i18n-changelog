const fs = require('fs');
const unset = require('unset-value');

module.exports = class ChangelogApplier {

    #changelog;
    #targetLangs;
    #dryRun;

    constructor(changelogPath, targetLangs, dryRun = false) {

        this.#dryRun = dryRun;

        this.#initChangelog(changelogPath);
        this.#initLangs(targetLangs);

        this.#applyChangelog();
    }

    #initChangelog(changelogPath) {
        if (!changelogPath)
            throw new Error('Please pass --changelog param');

        const changelogExists = fs.existsSync(changelogPath)

        if (!changelogExists)
            throw new Error('Please pass valid --changelog param');

        this.#changelog = JSON.parse(fs.readFileSync(changelogPath));
    }

    #initLangs(langs) {
        if (!langs)
            throw new Error('Please pass --langs param');

        if (!langs instanceof Array)
            throw new Error('Unexpected error while parsing langs');

        const validLangsGiven = langs.every(
            (lang) => typeof lang === 'string' && lang.match(/^[a-z]{2}-[a-z]{2}$/) !== null
        )

        if (!validLangsGiven)
            throw new Error('Langs parameter should contains lang in format xx-yy');

        this.#targetLangs = langs;
    }

    #applyChangelog() {
        const foldersToAmend = Object.keys(this.#changelog);

        foldersToAmend.forEach((folder) => {
            const folderChangelog = this.#changelog[folder];

            this.#targetLangs.forEach((lang) => {
                this.#applyChangelogToLanguage(folder, lang, folderChangelog)
            })
        })
    }

    #applyChangelogToLanguage(folder, lang, folderChangelog) {
        const targetFile = `${folder}${lang}.json`;

        try {
            const json = JSON.parse(fs.readFileSync(targetFile));

            Object.keys(folderChangelog).forEach((change) => {
                unset(json, change)
            })

            let writeHandler = !this.#dryRun ? fs.writeFileSync.bind(fs) : console.log.bind(console);

            writeHandler(
                targetFile,
                JSON.stringify(json, null, 2)
            );

        } catch (e) {
            console.warn(`WARNING: unable to apply changelog to: ${targetFile}`, e)
        }
    }

}
