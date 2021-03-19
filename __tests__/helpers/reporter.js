const pluralize = (word, count) => `${count} ${word}${count === 1 ? '' : 's'}`

const chalk = require('chalk')
const { stringify } = require('csv-string')

class JestSimpleDotReporter {
  pendingTests = []
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  onRunStart(test) {
    this._numTestSuitesLeft = test.numTotalTestSuites

    console.log()
    console.log(`Found ${test.numTotalTestSuites} test suites`)
  }

  onRunComplete(test, results) {
    const {
      numFailedTests,
      numPassedTests,
      numPendingTests,
      testResults,
      numTotalTests,
      startTime,
    } = results


    console.log()
    testResults.map(({ failureMessage }) => {
      if (failureMessage) {
        console.error(failureMessage)
      }
    })

    if (!results.snapshot.didUpdate && results.snapshot.unchecked) {
      const obsoleteError = `${pluralize(
        'obsolete snapshot',
        results.snapshot.unchecked,
      )} found.`
      if (this._options.color) console.error(`\x1b[31m${obsoleteError}\x1b[0m`)
      else console.error(obsoleteError)
    }

    console.log(`Ran ${numTotalTests} tests in ${testDuration()}`)
    console.log(`${chalk.green('Number of tests passed: ')}${numPassedTests || 0}`)
    // console.log(JSON.stringify(this.pendingTests, null, 2));
    this.pendingTests.forEach(({ testFilePath, specName, suiteName, status }) => {
      if (status === 'pending')
        console.log(chalk.yellow.bold(`${'! '} ${testFilePath.split('/').pop()} : ${suiteName.join('//')} [${specName}]`))
      else if (status === 'todo')
        console.log(chalk.white.bold(`${'? '} ${testFilePath.split('/').pop()} : ${suiteName.join('//')} [${specName}]`))
      else if (status === 'failed')
        console.log(chalk.red.bold(`${'✖ '} ${testFilePath.split('/').pop()} : ${suiteName.join('//')} [${specName}]`))
    })

    console.log()

    function testDuration() {
      const end = new Date()
      const start = new Date(startTime)

      const seconds = (end - start) / 1000
      return `${seconds} s`
    }
  }

  onTestResult(test, testResult) {
    for (let i = 0; i < testResult.testResults.length; i++) {
      if (testResult.testResults[i].status === 'passed') {
        process.stdout.write(chalk.green('✔ '))
      } else if (testResult.testResults[i].status === 'pending') {
        process.stdout.write(chalk.yellow.bold('! '))
      } else if (testResult.testResults[i].status === 'todo') {
        process.stdout.write(chalk.white.bold('? '))
      } else {
        process.stdout.write(chalk.red('✖ '))
      }
      if (testResult.testResults[i].status !== 'passed')
        this.pendingTests.push({
          testFilePath: testResult.testFilePath,
          suiteName: testResult.testResults[i].ancestorTitles,
          specName: testResult.testResults[i].title,
          status: testResult.testResults[i].status
        })
    }

    if (!--this._numTestSuitesLeft && this._globalConfig.collectCoverage) {
      console.log()
    }
  }
}

module.exports = JestSimpleDotReporter
