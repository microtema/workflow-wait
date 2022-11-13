import * as core from "@actions/core";

const RUN_TIMEOUT_SECONDS = 5 * 60;
const POLL_INTERVAL_MS = 5000;

/**
 * action.yaml definition.
 */
export interface ActionConfig {
  /**
   * GitHub API token for making requests.
   */
  token: string;

  /**
   * Repository of the action to await.
   */
  repo: string;

  /**
   * Owner of the given repository.
   */
  owner: string;

  /**
   * Run ID to await the completion of.
   */
  runId: number;

  /**
   * Time until giving up on the completion of an action.
   * @default 300
   */
  runTimeoutSeconds: number;

  /**
   * Frequency to poll the action for a status.
   * @default 2500
   */
  pollIntervalMs: number;
}

export function getConfig(): ActionConfig {

  const [owner, repo] = core.getInput('repo').split('/')

  return {
    token: core.getInput("token", {required: true}),
    repo,
    owner,
    runId: getRunIdFromValue(core.getInput("runId")),
    runTimeoutSeconds: getNumberFromValue(core.getInput("runTimeoutSeconds")) || RUN_TIMEOUT_SECONDS,
    pollIntervalMs: getNumberFromValue(core.getInput("pollIntervalMs")) || POLL_INTERVAL_MS,
  };
}

function getRunIdFromValue(value: string): number {

  const id = getNumberFromValue(value);
  if (id === undefined) {
    throw new Error("Run ID must be provided.");
  }
  return id;
}

function getNumberFromValue(value: string): number | undefined {
  if (value === "") {
    return undefined;
  }

  try {
    const num = parseInt(value);

    if (isNaN(num)) {
      throw new Error("Parsed value is NaN");
    }

    return num;
  } catch {
    throw new Error(`Unable to parse value: ${value}`);
  }
}
