import { Promise } from "es6-promise";
import { execCmd, IExecCmdParams } from "../CommandQueue";
import { PluginBase } from "../PluginBase";


describe("[commandQueue]", () => {

  class MockClass extends PluginBase {

    constructor() {
      super("mock_plugin");
      this._isReady = true;
    }

    public hoge(request): Promise<number> {
      const params: IExecCmdParams = {
        args: [
          request,
        ],
        context: this,
        methodName: "newInstance",
        pluginName: "mock_plugin",
      };

      return execCmd(params);
    }
  }

  it("should keep caller", () => {

    const instance: MockClass = new MockClass();
    const request: number = 1;
    expect(instance.hoge(request)).resolves.toBe([request]);

  });

});
