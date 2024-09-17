import React from "react";
import { VERSION } from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { TeamsView, FiltersListItemType} from "@twilio/flex-ui";

// import { SyncClient } from "twilio-sync";

// import CustomTaskListContainer from "./components/CustomTaskList/CustomTaskList.Container";
import reducers, { namespace } from "./states";
// import { type } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/RecognizerConfig";

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

    flex.DefaultTaskChannels.Chat.templates.TaskListItem.firstLine = (task) => {
      console.log("task", task);

      return task.attributes.from;
    }

    // const options = { sortOrder: -1 };
    // flex.AgentDesktopView.Panel1.Content.add(
    //   <CustomTaskListContainer key="SamplePlugin-component" />,
    //   options
    // );

    // try {
    //   const syncClientOptions = {
    //     productId: "flex_insights",
    //   };
    //   const insightsClient = new SyncClient(
    //     manager.user.token,
    //     syncClientOptions
    //   );

    //   const workspaceStatsMap = await insightsClient.map({
    //     id: "realtime_statistics_v1",
    //     mode: "open_existing",
    //   });
    //   const workspaceStats = await workspaceStatsMap.get("workspace");
    //   console.log("workspacestat", workspaceStats);
    // } catch (e) {
    //   console.log(e);
    // }


    // Create your custom field
    const CustomField = ({
      handleChange,
      currentValue,
      fieldName,
      options,
    }) => {
      const _handleChange = (e) => {
        e.preventDefault();
        handleChange(e.target.value);
      };

      return (
        <select
          className="CustomInput"
          onChange={_handleChange}
          value={currentValue}
          name={fieldName}
        >
          <option value="" key="default">
            All activities
          </option>
          {options.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    };

    // Define the label that will be displayed when filter is active
    const CustomLabel = ({ currentValue }) => (
      <>{currentValue || "All activities"}</>
    );

    const skillsArray = manager.serviceConfiguration.taskrouter_skills?.map(
      (skill) => ({
        value: skill.name,
        label: skill.name,
        default: false,
      })
    );

    const customFilters = [
      TeamsView.activitiesFilter,

      // skills filter
      {
        id: "data.attributes.routing.skills",
        title: "Agent Skills",
        fieldName: "skills",
        options: skillsArray,
        // customStructure: {
        //   label: <CustomLabel />,
        //   field: <CustomField />,
        // },
        type: FiltersListItemType.multiValue,
        condition: "IN",
      },
    ];

    flex.TeamsView.defaultProps.filters = customFilters;


    //    manager.updateConfig({
    //     componentProps: {
    //         TeamsView: {
    //             filters: [TeamsView.activitiesFilter, agentSkillsFilter],
    //         },
    //     },
    // });

    //  flex.Actions.invokeAction('ApplyTeamsViewFilters', {
    //   filters: agentSkillsFilter,
    // });
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
