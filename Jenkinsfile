@Library('jenkins-library')

def pipeline = new org.js.AppPipeline(
    steps:              this,
    test:               false,
    dockerRegistryCred: 'bot-sora2-rw',
    dockerImageName:    'sora2/subquery',
    buildDockerImage:   'docker.soramitsu.co.jp/build-tools/node:20-alpine',
    preBuildCmds:       ['yarn', 'yarn codegen'],
    buildCmds:          ['yarn build'],
    dockerImageTags:    ['feauture/dops-2860': 'dictionary']
)
pipeline.runPipeline()
