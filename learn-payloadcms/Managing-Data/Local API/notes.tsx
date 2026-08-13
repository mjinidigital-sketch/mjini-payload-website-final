/**
 * Local API:
 *  -The Payload Local API gives you the ability to execute the same operations 
 * that are available through REST and GraphQL within Node, 
 * directly on your server.
 * 
 * 
 * Some common examples of how you can use the Local API:

        Fetching Payload data within React Server Components
        Seeding data via Node seed scripts that you write and maintain
        Opening custom Next.js route handlers which feature additional functionality but still rely on Payload
        Within Access Control and Hooks
  
 */

/**
 * Access Control
 *  -Access control defines who can view, create, update, and delete documents in your collections.
 */

/**
 * Accessing Payload Data
 * You can gain access to the currently running payload object via two ways:
 *
 *      1. Importing Payload into the file where you need it
 * If you want to import Payload in places where you don't have the option to access it
 * from function arguments or req, you can import it and initialize it
 *
 * import { getPayload } from "payload"
 * import config  from '@payload-config'
 *
 * const payload = await getPayload({config })
 *      2. Using the Request context for incoming requests
 */
