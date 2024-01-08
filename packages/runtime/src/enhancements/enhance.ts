import { withOmit, WithOmitOptions } from './omit';
import { withPassword, WithPasswordOptions } from './password';
import { withPolicy, WithPolicyContext, WithPolicyOptions } from './policy';

/**
 * Options @see enhance
 */
export type EnhancementOptions = WithPolicyOptions & WithPasswordOptions & WithOmitOptions;

let hasPassword: boolean | undefined = undefined;
let hasOmit: boolean | undefined = undefined;

/**
 * Gets a Prisma client enhanced with all essential behaviors, including access
 * policy, field validation, field omission and password hashing.
 *
 * It's a shortcut for calling withOmit(withPassword(withPolicy(prisma, options))).
 *
 * @param prisma The Prisma client to enhance.
 * @param context The context to for evaluating access policies.
 * @param options Options.
 */
export function createEnhancement<DbClient extends object>(
    prisma: DbClient,
    options: EnhancementOptions,
    context?: WithPolicyContext
) {
    let result = prisma;

    if (hasPassword === undefined || hasOmit === undefined) {
        const allFields = Object.values(options.modelMeta.fields).flatMap((modelInfo) => Object.values(modelInfo));
        hasPassword = allFields.some((field) => field.attributes?.some((attr) => attr.name === '@password'));
        hasOmit = allFields.some((field) => field.attributes?.some((attr) => attr.name === '@omit'));
    }

    if (hasPassword) {
        // @password proxy
        result = withPassword(result, options);
    }

    if (hasOmit) {
        // @omit proxy
        result = withOmit(result, options);
    }

    // policy proxy
    result = withPolicy(result, options, context);

    return result;
}
