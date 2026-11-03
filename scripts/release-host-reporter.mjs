// Print the host's state beside every test that does not pass in the release
// run, so a timeout carries the load and memory it happened under (#901).

import {describeHost} from './release-host.mjs';

export default class ReleaseHostReporter {
  onTestEnd(test, result) {
    if (result.status === 'passed' || result.status === 'skipped') return;
    const at = new Date().toISOString();
    console.log(`Release host at ${at}, after ${result.status} "${test.titlePath().slice(1).join(' › ')}": ${describeHost()}`);
  }

  printsToStdio() {
    return true;
  }
}
