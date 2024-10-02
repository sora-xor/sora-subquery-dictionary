@Library('jenkins-library')

def pipeline = new org.js.AppPipeline(
    steps:              this,
    test:               false,
    dockerRegistryCred: 'bot-sora2-rw',
    dockerImageName:    'sora2/subquery',
    buildDockerImage:   'docker.soramitsu.co.jp/build-tools/node:20-alpine',
    preBuildCmds:       ['yarn install', 'yarn codegen'],
    dockerImageTags:    ['npolyakov/update-dictionary': 'dict-prod-2']
)
pipeline.runPipeline()
