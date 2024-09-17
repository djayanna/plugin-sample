import React from "react";
import { VERSION, Flex , Actions} from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { TeamsView, FiltersListItemType} from "@twilio/flex-ui";

import reducers, { namespace } from "./states";

const PLUGIN_NAME = "SamplePlugin";

export default class SamplePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    // hide CRM panel
    flex.AgentDesktopView.defaultProps.showPanel2 = false;

    Actions.addListener("afterSelectTask", (payload) => {
      console.log("payload", payload);
    });

  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
