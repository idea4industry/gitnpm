# typescript-jest-starter

## This starter covers

 - Basic tsconfig.json
 - Complete eslint/prettier/airbnb-config
 - Jest testing setup
 - Nice HTML reports for test results and coverage (run `npm test` and `npm test:browser`)
 - Basic sample files showing jest mocking and spying.
 - Basic boilerplate config for npm package creation

## linux aliases / functions

```shell

function testcov(){
  npm run test:watch -- \
    --testPathPattern="$@" \
    --collectCoverageFrom="**/$@*.ts" \
    --collectCoverageFrom="**/$@*/**/*.ts"
}

function test(){
  npm run test:watch -- --coverage=false --testPathPattern="$@" --reporters="default"
}

alias compile='npm run compile:watch'
alias lint='npm run lint:watch'

```