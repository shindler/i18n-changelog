A simple package to apply changes to i18n json files based on simple convention of changelog files.

How to use this:

1. create a directory with changelog files
2. create a changelog file with .json extension
3. store changes in this file following convention:
{
    'folder/: {
        'key': 'comment'
        'nested.key': 'comment'
    }
}

Params to command:
--langs list of comma separated langs in format xx-yy that will be processed
--changelog changelog file to use
--dryRun run in dry run mode or apply changes directly to files

Example based on example in example folder:
node index --changelog examples/changelog/version_1.json --langs fr-fr --dryRun true
