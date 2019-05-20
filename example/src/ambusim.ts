import {
  Module,
  EntityType,
  PropertyType,
  PropertyDataType,
  BehaviourModel,
  createEntity,
  Geometry,
  ValueIndicator,
  IndicatorType,
  MapIndicator,
  MapIndicatorMarker,
  BarIndicator,
} from 'simulus';

/*

example scenario:

accident: 59.413298, 24.806158
hospitals:
59.427546, 24.756372

patients: 50
criticality: 3
radius: 0.005

*/

const moduleId = 'com.ukutammet.ambusim.v1';

// Properties /////////////////////////////////////////////////

const Location: PropertyType = {
  id: 'location',
  name: 'location',
  description: 'lat/lng of a hospital',
  dataType: PropertyDataType.GEOMETRY,
};

const Health: PropertyType = {
  id: 'health',
  name: 'health',
  description: 'How ok this patient is on a scale of 1-5',
  dataType: PropertyDataType.NUMBER,
};

const Condition: PropertyType = {
  id: 'condition',
  name: 'condition',
  description: 'Is this patient stable or critical',
  dataType: PropertyDataType.STRING,
};

const BedCount: PropertyType = {
  id: 'bedCount',
  name: 'bed count',
  description: 'how many beds a hospital has',
  dataType: PropertyDataType.NUMBER,
};

// Entity types ///////////////////////////////////////////////

const Hospital: EntityType = {
  id: `${moduleId}.hospital`,
  name: 'Hospital',
  description: 'What ambulances use as a station',
  ownProperties: [Location, BedCount],
};

const Patient: EntityType = {
  id: `${moduleId}.patient`,
  name: 'Patient',
  description: 'A patient that might need help',
  ownProperties: [Location, Health, Condition],
};

const Ambulance: EntityType = {
  id: `${moduleId}.ambulance`,
  name: 'Ambulance',
  description: 'An ambulance that drives around',
  ownProperties: [Location],
};

// Models ///////////////////////////////////////////////
const AccidentModel: BehaviourModel = {
  id: `${moduleId}.model.accident`,
  name: 'Start an accident at some place to create patients',
  parameterSchema: {
    type: 'object',
    required: ['latitude', 'longitude', 'magnitude', 'criticality'],
    properties: {
      latitude: {
        type: 'number',
        title: 'Latitude of accident',
      },
      longitude: {
        type: 'number',
        title: 'Longitude of accident',
      },
      radius: {
        type: 'number',
        title: 'Radius size of accident',
      },
      magnitude: {
        type: 'integer',
        title: 'Magnitude (how many people are effected, 1-2000)',
        minimum: 1,
        maximum: 2000,
      },
      criticality: {
        type: 'integer',
        title: 'Criticality (how bad was the average person affected, 1-5)',
        minimum: 1,
        maximum: 5,
      },
    },
  },
  run: (state, params, cb) => {
    function getBiasRandom(min: number, max: number, bias: number, influence: number = 1): number {
      const rnd = Math.random() * (max - min) + min;
      const mix = Math.random() * influence; // random mixer
      return rnd * (1 - mix) + bias * mix; // mix full range and bias
    }

    function randomWithinRadius(value: number, radius: number) {
      return radius * Math.random() * (Math.random() < 0.5 ? -1 : 1) + value;
    }

    for (let index = 0; index < params.magnitude; index++) {
      const entity = createEntity({
        typeId: Patient.id,
        name: `Patient ${index}`,
      });
      const health = {
        type: Health,
        value: getBiasRandom(-1, 5, 5 - params.criticality),
      };
      state.entities = state.entities.concat([
        {
          ...entity,
          type: Patient,
          archived: false,
          properties: {
            location: {
              type: Location,
              value: {
                x: randomWithinRadius(params.latitude, params.radius),
                y: randomWithinRadius(params.longitude, params.radius),
              },
            },
            health,
            condition: {
              type: Condition,
              value:
                health.value < 2 || (health.value < 3 && Math.random() < 0.5)
                  ? 'critical'
                  : 'stable',
            },
          },
        },
      ]);
    }

    cb(state);
  },
};

const AmbulanceAndPatientBehaviourModel: BehaviourModel = {
  id: `${moduleId}.model.ambulanceAndPatientBehaviour`,
  name: 'Ambulance/patient behaviour',
  parameterSchema: {
    type: 'object',
    required: ['time'],
    properties: {
      time: {
        type: 'number',
        title: 'Time to simulate, in minutes (0-1440)',
        minimum: 0,
        maximum: 1440,
      },
    },
  },
  // cannot access variable outside the scope, as it will be run in a worker
  runInWorker(state, params, cb) {
    // Helpers ///////////////////////////////////////////////////
    const moduleId = 'com.ukutammet.ambusim.v1';
    const PatientId = `${moduleId}.patient`;
    const AmbulanceId = `${moduleId}.ambulance`;

    const EARTH_RADIUS = 6378100;
    const AMBULANCE_SPEED = 40;

    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180);
    }

    // Haversine formula, implementation from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    function distance(firstPoint: Geometry, secondPoint: Geometry): number {
      // returns distance in meters
      const dLat = deg2rad(secondPoint.x - firstPoint.x); // deg2rad below
      const dLon = deg2rad(secondPoint.y - firstPoint.y);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(firstPoint.x)) *
          Math.cos(deg2rad(secondPoint.x)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = EARTH_RADIUS * c;
      return d;
    }

    function copy<T>(data: T): T {
      return JSON.parse(JSON.stringify(data));
    }

    const isNear = (number: number): boolean => number < 20; // below 20m

    while (params.time--) {
      // a tick every minute
      const alivePatients = state.entities.filter(
        entity => entity.type.id === PatientId && entity.properties.health.value > 0,
      );
      const criticalPatients = alivePatients.filter(
        patient => patient.properties.condition.value === 'critical',
      );
      const ambulances = state.entities.filter(entity => entity.type.id === AmbulanceId);
      // const hospitals = state.entities.filter(entity => entity.id === HospitalId);
      // first, simulate critical patients getting worse.
      criticalPatients.forEach(criticalPatient => {
        criticalPatient.properties.health.value =
          (criticalPatient.properties.health.value as number) - 0.05; // takes 20 minutes to go down 1 point of health
      });

      // state
      const movementTargets: { [key: string]: Geometry } = {};

      // pick targets for ambulances
      ambulances.forEach(ambulance => {
        const currentTarget = movementTargets[ambulance.id];
        const location = ambulance.properties.location.value as Geometry;
        if (!currentTarget && location) {
          const nearestCriticalPatients = alivePatients
            .filter(patient => {
              const condition = patient.properties.condition.value as string;
              const location = patient.properties.location.value as Geometry;
              return condition && location ? condition === 'critical' : false;
            })
            .sort((a, b) => {
              const aLocation = a.properties.location.value as Geometry;
              const bLocation = b.properties.location.value as Geometry;
              return distance(location, aLocation) - distance(location, bLocation);
            });
          if (nearestCriticalPatients.length) {
            const patient = nearestCriticalPatients[0];
            const patientLocation = patient.properties.location.value as Geometry;
            const currentDistance = distance(location, patientLocation);
            if (isNear(currentDistance)) {
              // Stabilise patient
              patient.properties.condition.value = 'stable';
            } else {
              // Move to patient
              movementTargets[ambulance.id] = copy(patientLocation);
            }
          }
        }
      });

      // run movement
      Object.keys(movementTargets).forEach(entityId => {
        const entity = state.entities.find(entity => entity.id === entityId)!;
        const speed = AMBULANCE_SPEED * 16.66;
        const location = entity.properties.location.value as Geometry;
        const target = movementTargets[entityId]!;
        if (entity && speed && location && target) {
          const currentDistance = distance(location, target);
          if (!isNear(currentDistance)) {
            const moveSpeed = Math.min(speed, currentDistance);
            location.x += ((target.x - location.x) / currentDistance) * moveSpeed;
            location.y += ((target.y - location.y) / currentDistance) * moveSpeed;
          } else {
            delete movementTargets[entityId];
          }
        }
      });
    }

    cb(state);
  },
};

// Indicators ///////////////////////////////////////////////

const AlivePatientsIndicator: ValueIndicator = {
  id: `${moduleId}.indicator.alivePatients`,
  name: 'Alive patients',
  type: IndicatorType.VALUE,
  calculate: state =>
    state.entities.filter(
      entity => entity.type.id === Patient.id && entity.properties.health.value > 0,
    ).length,
};

const DeadPatientsIndicator: ValueIndicator = {
  id: `${moduleId}.indicator.deadPatients`,
  name: 'Dead patients',
  type: IndicatorType.VALUE,
  calculate: state =>
    state.entities.filter(
      entity => entity.type.id === Patient.id && entity.properties.health.value < 0,
    ).length,
};

const CriticalPatientsIndicator: ValueIndicator = {
  id: `${moduleId}.indicator.criticalPatients`,
  name: 'Critical patients',
  type: IndicatorType.VALUE,
  calculate: state =>
    state.entities.filter(
      entity => entity.type.id === Patient.id && entity.properties.condition.value === 'critical',
    ).length,
};

const StablePatientsIndicator: ValueIndicator = {
  id: `${moduleId}.indicator.stablePatients`,
  name: 'Stable patients',
  type: IndicatorType.VALUE,
  calculate: state =>
    state.entities.filter(
      entity => entity.type.id === Patient.id && entity.properties.condition.value !== 'critical',
    ).length,
};

const WorldMap: MapIndicator = {
  id: `${moduleId}.indicator.worldMap`,
  name: 'World map',
  type: IndicatorType.MAP,
  calculate: state => {
    const markers: MapIndicatorMarker[] = [];
    state.entities.forEach(entity => {
      if (entity.type.id === Patient.id) {
        const location = entity.properties.location.value as Geometry;
        const health = entity.properties.health.value as number;
        const isCritical = (entity.properties.condition.value as string) === 'critical';
        let color = 'green';
        if (health < 0) {
          color = 'black';
        } else if (health < 2 || isCritical) {
          color = 'red';
        } else if (health < 3) {
          color = 'yellow';
        }
        markers.push({
          latitude: location.x,
          longitude: location.y,
          content: {
            icon: {
              color,
              name: 'user',
            },
          },
        });
      } else if (entity.type.id === Ambulance.id) {
        const location = entity.properties.location.value as Geometry;
        markers.push({
          latitude: location.x,
          longitude: location.y,
          content: {
            icon: {
              color: 'blue',
              name: 'ambulance',
            },
          },
        });
      }
    });
    return {
      mapBoxToken:
        'pk.eyJ1IjoidGFua2Vuc3RlaW4iLCJhIjoiY2p2NHlwZnhmMWg1dDQzcDk5ajhjNXdjeiJ9.2w-6uYLrlgHl1FTEpCBLaA',
      latitude: 59.437, // Tallinn
      longitude: 24.7536,
      zoom: 10,
      markers,
    };
  },
};

const PatientsByCondition: BarIndicator = {
  id: `${moduleId}.indicator.patientsByCondition`,
  type: IndicatorType.BAR,
  name: 'Patients by health',
  calculate: state => {
    function patientsByHealth(pred: (health: number) => boolean): number {
      return state.entities.filter(
        entity => entity.type.id === Patient.id && pred(entity.properties.health.value as number),
      ).length;
    }
    return [
      {
        x: '<= 1',
        y: patientsByHealth(h => h <= 1),
      },
      {
        x: '<= 2',
        y: patientsByHealth(h => h <= 2 && h > 1),
      },
      {
        x: '<= 3',
        y: patientsByHealth(h => h <= 3 && h > 2),
      },
      {
        x: '<= 4',
        y: patientsByHealth(h => h <= 4 && h > 3),
      },
      {
        x: '<= 5',
        y: patientsByHealth(h => h <= 5 && h > 4),
      },
    ];
  },
};

const Ambusim: Module = {
  id: moduleId,
  name: 'Ambusim',
  description: 'Facilities to run basic and naive geographic ambulance simulations.',
  entityTypes: [Hospital, Patient, Ambulance],
  models: [AccidentModel, AmbulanceAndPatientBehaviourModel],
  indicators: [
    WorldMap,
    DeadPatientsIndicator,
    AlivePatientsIndicator,
    CriticalPatientsIndicator,
    StablePatientsIndicator,
    PatientsByCondition,
  ],
};

export default Ambusim;
