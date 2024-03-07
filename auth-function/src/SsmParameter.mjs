import { GetParameterCommand } from '@aws-sdk/client-ssm';

export class SsmParameter {
  constructor({ parameterName, ssmClient }) {
    this.parameterName = parameterName;
    this.ssmClient = ssmClient;
    this.parameterPromise = null;
  }

  getValue() {
    if (!this.parameterPromise) {
      this.parameterPromise = this.getParameterValue();
    }

    return this.parameterPromise;
  }

  async getParameterValue() {
    const getParameterCommand = new GetParameterCommand({ Name: this.parameterName });

    const getParameterResponse = await this.ssmClient.send(getParameterCommand);

    if (!getParameterResponse.Parameter || !getParameterResponse.Parameter.Value) {
      throw new Error('Parameter or parameter value missing');
    }

    return getParameterResponse.Parameter.Value;
  }
}
