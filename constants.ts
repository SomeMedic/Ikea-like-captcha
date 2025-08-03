
import { FurnitureData } from './types';

const LEG_RADIUS = 0.1;
const LEG_HEIGHT = 2.0;
const BACK_UPRIGHT_HEIGHT = 2.5;

export const CHAIR_DATA: FurnitureData = {
  seat: {
    isStatic: true,
    geometry: { type: 'box', args: [2, 0.2, 2] },
    initialPosition: [0, 1.9, 0], // Raised the seat to a more appropriate height
    connectionPoints: {
      'seat_for_leg_bl': { pos: [-0.8, -0.1, -0.8], target: 'leg_bl_top' },
      'seat_for_leg_br': { pos: [0.8, -0.1, -0.8], target: 'leg_br_top' },
      'seat_for_leg_fl': { pos: [-0.8, -0.1, 0.8], target: 'leg_fl_top' },
      'seat_for_leg_fr': { pos: [0.8, -0.1, 0.8], target: 'leg_fr_top' },
      'seat_for_upright_l': { pos: [-0.8, 0.1, -0.9], target: 'upright_l_bottom' },
      'seat_for_upright_r': { pos: [0.8, 0.1, -0.9], target: 'upright_r_bottom' },
    }
  },
  leg_bl: {
    geometry: { type: 'cylinder', args: [LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT, 16] },
    initialPosition: [-3, 1, -2],
    connectionPoints: {
      'leg_bl_top': { pos: [0, LEG_HEIGHT / 2, 0], target: 'seat_for_leg_bl' }
    }
  },
  leg_br: {
    geometry: { type: 'cylinder', args: [LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT, 16] },
    initialPosition: [3, 1, -2],
    connectionPoints: {
      'leg_br_top': { pos: [0, LEG_HEIGHT / 2, 0], target: 'seat_for_leg_br' }
    }
  },
  leg_fl: {
    geometry: { type: 'cylinder', args: [LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT, 16] },
    initialPosition: [-3, 1, 2],
    connectionPoints: {
      'leg_fl_top': { pos: [0, LEG_HEIGHT / 2, 0], target: 'seat_for_leg_fl' }
    }
  },
  leg_fr: {
    geometry: { type: 'cylinder', args: [LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT, 16] },
    initialPosition: [3, 1, 2],
    connectionPoints: {
      'leg_fr_top': { pos: [0, LEG_HEIGHT / 2, 0], target: 'seat_for_leg_fr' }
    }
  },
  back_upright_left: {
    geometry: { type: 'cylinder', args: [LEG_RADIUS, LEG_RADIUS, BACK_UPRIGHT_HEIGHT, 16] },
    initialPosition: [-2, 3, -3],
    connectionPoints: {
      'upright_l_bottom': { pos: [0, -BACK_UPRIGHT_HEIGHT / 2, 0], target: 'seat_for_upright_l' },
      'upright_l_for_rail': { pos: [0, BACK_UPRIGHT_HEIGHT / 2 - 0.2, 0.05], target: 'rail_left_end' },
    }
  },
  back_upright_right: {
    geometry: { type: 'cylinder', args: [LEG_RADIUS, LEG_RADIUS, BACK_UPRIGHT_HEIGHT, 16] },
    initialPosition: [2, 3, -3],
    connectionPoints: {
      'upright_r_bottom': { pos: [0, -BACK_UPRIGHT_HEIGHT / 2, 0], target: 'seat_for_upright_r' },
      'upright_r_for_rail': { pos: [0, BACK_UPRIGHT_HEIGHT / 2 - 0.2, 0.05], target: 'rail_right_end' },
    }
  },
  back_rail: {
    geometry: { type: 'box', args: [1.6, 0.4, 0.1] },
    initialPosition: [0, 4, -3],
    connectionPoints: {
        'rail_left_end': { pos: [-0.8, 0, 0], target: 'upright_l_for_rail' },
        'rail_right_end': { pos: [0.8, 0, 0], target: 'upright_r_for_rail' },
    }
  }
};