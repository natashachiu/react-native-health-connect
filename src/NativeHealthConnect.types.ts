interface Energy {
  value: number;
  unit: 'calories' | 'joules' | 'kilocalories' | 'kilojoules';
}

interface BloodGlucose {
  value: number;
  unit: 'milligramsPerDeciliter' | 'millimolesPerLiter';
}

interface Power {
  value: number;
  unit: 'watts' | 'kilocaloriesPerDay';
}

interface Temperature {
  value: number;
  unit: 'celsius' | 'fahrenheit';
}

interface BaseRecord {
  metadata?: Metadata;
}

interface BaseRecordWithTime extends BaseRecord {
  time: string;
  zoneOffset?: string;
}

interface Metadata {
  id: string;
  // package name of the app that created the record
  dataOrigin: string;
  lastModifiedTime: string;
  clientRecordId?: string;
  clientRecordVersion: number;
  // see: https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/metadata/Device
  device: number;
}

interface ActiveCaloriesBurnedRecord extends BaseRecord {
  recordType: 'activeCaloriesBurned';
  startTime: string;
  startZoneOffset?: string;
  endTime: string;
  endZoneOffset?: string;
  energy: Energy;
}

interface BasalBodyTemperatureRecord extends BaseRecordWithTime {
  recordType: 'basalBodyTemperature';
  temperature: Temperature;
  measurementLocation: number;
}

interface BasalMetabolicRateRecord extends BaseRecordWithTime {
  recordType: 'basalMetabolicRate';
  basalMetabolicRate: Power;
}

interface BloodGlucoseRecord extends BaseRecordWithTime {
  recordType: 'bloodGlucose';
  level: BloodGlucose;
  specimenSource: number;
  mealType: number;
  relationToMeal: number;
}

export type HealthConnectRecord =
  | ActiveCaloriesBurnedRecord
  | BasalBodyTemperatureRecord
  | BasalMetabolicRateRecord
  | BloodGlucoseRecord;

export interface Permission {
  accessType: 'read' | 'write';
  recordType: RecordTypes;
}

export type RecordTypes = HealthConnectRecord['recordType'];