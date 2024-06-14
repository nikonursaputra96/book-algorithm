/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - email
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code of the member
 *         name:
 *           type: string
 *           description: The name of the member
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the member
 */

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: API to manage library member
 */

import { Router } from 'express';
import { getMembers, createMember, updateMember, deleteMember, findByCode, clearPenalty } from '../controllers/memberController'

const memberRoutes = Router();

/**
 * @swagger
 * /member:
 *   get:
 *     summary: Retrieve all member
 *     tags: [Members]
 *     responses:
 *       '200':
 *         description: A list of member
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
memberRoutes.get('/', getMembers);

/**
 * @swagger
 * /member/{code}:
 *   get:
 *     summary: Retrieve a member by code
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the member to retrieve
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 */
memberRoutes.get('/:code', findByCode);

/**
 * @swagger
 * /member:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 */
memberRoutes.post('/', createMember);

/**
 * @swagger
 * /member/{code}:
 *   put:
 *     summary: Update a member by code
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the member to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       '200':
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 */
memberRoutes.put('/:code', updateMember);

/**
 * @swagger
 * /member/{code}:
 *   delete:
 *     summary: Delete a member by code
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the member to delete
 *     responses:
 *       '204':
 *         description: No content
 */
memberRoutes.delete('/:code', deleteMember);

/**
 * @swagger
 * /member/{memberCode}/clear-penalty:
 *   post:
 *     summary: Clear penalty for a member
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: memberCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the member to clear penalty for
 *     responses:
 *       '200':
 *         description: OK
 */
memberRoutes.post('/:memberCode/clear-penalty', clearPenalty);

export default memberRoutes;
