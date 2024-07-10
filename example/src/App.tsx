import * as React from 'react';

import { Button, StyleSheet, View } from 'react-native';
import {
  SdkAvailabilityStatus,
  aggregateRecord,
  getChanges,
  getChangesToken,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  insertRecords,
  openHealthConnectDataManagement,
  openHealthConnectSettings,
  readRecord,
  readRecords,
  requestPermission,
  revokeAllPermissions,
} from 'react-native-health-connect';

const getLastWeekDate = (): Date => {
  return new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
};

const getLastTwoWeeksDate = (): Date => {
  return new Date(new Date().getTime() - 2 * 7 * 24 * 60 * 60 * 1000);
};

const getTodayDate = (): Date => {
  return new Date();
};

export default function App() {
  const initializeHealthConnect = async () => {
    const result = await initialize();
    console.log({ result });
  };

  const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      console.log('SDK is available');
    }

    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      console.log('SDK is not available');
    }

    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      console.log('SDK is not available, provider update required');
    }
  };

  const insertSampleData = () => {
    insertRecords([
      {
        recordType: 'ExerciseSession',
        exerciseType: 56,
        startTime: getLastWeekDate().toISOString(),
        endTime: getTodayDate().toISOString(),
      },
    ])
      .then((ids) => {
        console.log('Records inserted ', { ids });
      })
      .catch((err) => {
        console.error('Error inserting records ', { err });
      });
  };

  const readSampleData = () => {
    readRecords('ExerciseSession', {
      timeRangeFilter: {
        operator: 'between',
        startTime: getLastTwoWeeksDate().toISOString(),
        endTime: getTodayDate().toISOString(),
      },
    })
      .then((result) => {
        console.log('Retrieved records: ', JSON.stringify({ result }, null, 2));
      })
      .catch((err) => {
        console.error('Error reading records ', { err });
      });
  };

  const readSampleDataSingle = () => {
    readRecord('Steps', 'a7bdea65-86ce-4eb2-a9ef-a87e6a7d9df2')
      .then((result) => {
        console.log('Retrieved record: ', JSON.stringify({ result }, null, 2));
      })
      .catch((err) => {
        console.error('Error reading record ', { err });
      });
  };

  const aggregateSampleData = () => {
    aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime: getLastWeekDate().toISOString(),
        endTime: getTodayDate().toISOString(),
      },
    }).then((result) => {
      console.log('Aggregated record: ', { result });
    });
  };

  const requestSamplePermissions = () => {
    requestPermission([
      { accessType: 'read', recordType: 'ExerciseSession' },
      { accessType: 'write', recordType: 'ExerciseSession' },
    ]).then((permissions) => {
      console.log('Granted permissions on request ', { permissions });
    });
  };

  const grantedPermissions = () => {
    getGrantedPermissions()
      .then((permissions) => {
        console.log('Granted permissions ', { permissions });
        if (grantedPermissions.length === 0) {
          console.warn('No permissions were granted for ExerciseSession.');
        }
      })
      .catch((err) => {
        console.error('Error getting granted permissions ', { err });
      });
  };

  const getSampleChangesToken = async () => {
    let result = '';
    try {
      result = await getChangesToken('ExerciseSession');
    } catch (err) {
      console.error('Error getting changes token for ExerciseSession:', err);
    }
    console.log('Result:', result);
  };

  const getSampleChanges = async (token: string) => {
    try {
      const result = await getChanges('ExerciseSession', token);
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Error getting changes for ExerciseSession:', err);
    }
  };

  // this should be stored in async storage
  // for now, paste the token here after fetching
  const TOKEN = 'xxxxx';

  return (
    <View style={styles.container}>
      <Button title="Initialize" onPress={initializeHealthConnect} />
      <Button
        title="Open Health Connect settings"
        onPress={openHealthConnectSettings}
      />
      <Button
        title="Open Health Connect data management"
        onPress={() => openHealthConnectDataManagement()}
      />
      <Button title="Check availability" onPress={checkAvailability} />
      <Button
        title="Request sample permissions"
        onPress={requestSamplePermissions}
      />
      <Button title="Get granted permissions" onPress={grantedPermissions} />
      <Button title="Revoke all permissions" onPress={revokeAllPermissions} />
      <Button title="Insert sample data" onPress={insertSampleData} />
      <Button title="Read sample data" onPress={readSampleData} />
      <Button title="Read specific data" onPress={readSampleDataSingle} />
      <Button title="Aggregate sample data" onPress={aggregateSampleData} />
      <Button title="Get changes token" onPress={getSampleChangesToken} />
      <Button title="Get changes" onPress={() => getSampleChanges(TOKEN)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 16,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
