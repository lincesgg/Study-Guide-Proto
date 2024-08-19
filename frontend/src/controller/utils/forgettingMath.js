export
function forgetPercentage(daysSinceLastRevision, coeff) {
    return 100 / (Math.E**(daysSinceLastRevision*coeff))
}
  
export
function howManyDaysToForgetInFunctionOfRevisionsAmount(revisionAmout) {
    return 17 * revisionAmout - 7
}

export
function forgetPercentageCoeffToForgetContentInXDays(days) {
    return Math.log(100) / days
}
 
export
function forgetPercentageBasedOnReviewAmount(timeSinceLastReview, reviewAmount) {
    const coeff = forgetPercentageCoeffToForgetContentInXDays(
      howManyDaysToForgetInFunctionOfRevisionsAmount(reviewAmount)
    )
  
    return forgetPercentage(timeSinceLastReview, coeff)
}