@Library('jenkins-library')

def pipeline = new org.js.AppPipeline(
    steps:              this,
    test:               false,
    dockerRegistryCred: 'bot-sora2-rw',
    dockerImageName:    'sora2/subquery',
    buildDockerImage:   'docker.soramitsu.co.jp/build-tools/node:14-ubuntu',
    preBuildCmds:       ['yarn install', 'yarn codegen'],
    dockerImageTags:    ['feature/dops-2062/prod_dict': 'dict-prod-2']
)
pipeline.runPipeline()
