import { validationResult, body } from 'express-validator';



export const  signInvalidation =async(req, res, next)=> {
const rules = [
  body('username')
    .notEmpty()
    .withMessage('🔶 Username is required. Please fill it in.')
    .isLength({ min: 4, max: 12 })
    .withMessage('🔶 Name should have between 4 to 12 characters')
    .matches(/^[A-Za-z]+$/)
    .withMessage('🔶 Username must contain only letters (no numbers or special characters).'),
];
  // Run all validation rules   run method returns promise.
  //  await Promise.all(rules.map((rule) => rule.run(req)));

  // Run validations sequentially to preserve order
  //it is similar to forEach loop but this can handle await
  for (let rule of rules) {
    await rule.run(req);
  }

  // Get validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg })),
    });
  } else {
    next();
  }
};

