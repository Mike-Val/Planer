import { describe, test, expect } from '@jest/globals';
import { Vector3, Plane } from 'three';
import { findPlane, PlaneResult } from '../src/index';

describe('findPlane', () => {
    const coplanarPoints = [
        [7, 5, 2],
        [1, 6, -1],
        [-5, 1, 8],
        [5.38, -0.14, 12],
        [-13.41, -1.98, 12.56],
        [4.05, 1.79, 7.93],
        [11.23, 3.35, 6.01],
        [-9.26, 6.64, -3.99],
        [-13.56, 0.69, 7.19]
    ];
    const planeCenter = new Vector3(-1.4, 2.48, 5.63);
    const planeNormal = new Vector3(-6, 72, 36).normalize();

    const checkPlaneResult = (res: PlaneResult | null, expectedCenter: Vector3, expectedNormal: Vector3) => {
        expect(res).not.toBeNull();
        expect(res).toHaveProperty('plane');
        expect(res).toHaveProperty('center');
        res!.center?.toArray().forEach((c, i) => expect(c).toBeCloseTo(expectedCenter.toArray()[i]));
        expect(Math.abs(res!.plane.normal.dot(planeNormal))).toBeCloseTo(1);
    }


    test('should return null when no points are provided', () => {
        expect(findPlane(null as any)).toBeNull();
        expect(findPlane(undefined as any)).toBeNull();
    });

    test('should return null when less than 3 points are provided', () => {
        expect(findPlane([])).toBeNull();
        expect(findPlane([[1, 2, 3], [4, 5, 6]])).toBeNull();
    });

    test('should correctly find a plane from points', () => {
        const res = findPlane(coplanarPoints);
        checkPlaneResult(res, planeCenter, planeNormal);
    });

    test('should correctly find a plane from Vector3 points', () => {
        const points = coplanarPoints.map(point => new Vector3(...point));
        const res = findPlane(points);
        checkPlaneResult(res, planeCenter, planeNormal);
    });

    test('should use provided plane if available', () => {
        const providedPlane = new Plane();
        const res = findPlane(coplanarPoints, { plane: providedPlane });
        checkPlaneResult(res, planeCenter, planeNormal);
        expect(res!.plane).toBe(providedPlane);
    });

    test('should skip checks if unsafe option is provided', () => {
        const res = findPlane(coplanarPoints, { unsafe: true });
        checkPlaneResult(res, planeCenter, planeNormal);
    });
});