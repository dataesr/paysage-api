import { db } from '../../services/mongo.service';

export async function setStructureStatus() {
  return db.collection('structures')
    .updateMany(
      { structureStatus: { $ne: 'inactive' } },
      [
        {
          $addFields: {
            normalizedEndDate: {
              $switch: {
                branches: [
                  {
                    case: {
                      $regexMatch: {
                        input: "$closureDate",
                        regex: /^\d{4}$/
                      }
                    },
                    then: {
                      $concat: ["$closureDate", "-12-31"]
                    }
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: "$closureDate",
                        regex: /^\d{4}-\d{2}$/
                      }
                    },
                    then: {
                      $let: {
                        vars: {
                          year: { $substr: ["$closureDate", 0, 4] },
                          month: { $substr: ["$closureDate", 5, 2] }
                        },
                        in: {
                          $concat: [
                            "$closureDate",
                            "-",
                            {
                              $switch: {
                                branches: [
                                  {
                                    case: { $in: ["$$month", ["04", "06", "09", "11"]] },
                                    then: "30"
                                  },
                                  {
                                    case: { $eq: ["$$month", "02"] },
                                    then: {
                                      $cond: {
                                        if: {
                                          $eq: [
                                            { $mod: [{ $toInt: "$$year" }, 4] },
                                            0
                                          ]
                                        },
                                        then: "29",
                                        else: "28"
                                      }
                                    }
                                  }
                                ],
                                default: "31"
                              }
                            }
                          ]
                        }
                      }
                    }
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: "$closureDate",
                        regex: /^\d{4}-\d{2}-\d{2}$/
                      }
                    },
                    then: "$closureDate"
                  }
                ],
                default: null
              }
            },
            normalizedCreationDate: {
              $switch: {
                branches: [
                  {
                    case: {
                      $regexMatch: {
                        input: "$creationDate",
                        regex: /^\d{4}$/
                      }
                    },
                    then: {
                      $concat: ["$creationDate", "-01-01"]
                    }
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: "$creationDate",
                        regex: /^\d{4}-\d{2}$/
                      }
                    },
                    then: {
                      $concat: ["$creationDate", "-01"]
                    }
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: "$creationDate",
                        regex: /^\d{4}-\d{2}-\d{2}$/
                      }
                    },
                    then: "$creationDate"
                  }
                ],
                default: null
              }
            }
          }
        },
        {
          $set: {
            structureStatus: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$normalizedCreationDate", null] },
                    {
                      $gt: [
                        { $dateFromString: { dateString: "$normalizedCreationDate" } },
                        "$$NOW"
                      ]
                    }
                  ]
                },
                then: "forthcoming",
                else: {
                  $cond: {
                    if: { $eq: ["$normalizedEndDate", null] },
                    then: "active",
                    else: {
                      $cond: {
                        if: {
                          $gt: [
                            { $dateFromString: { dateString: "$normalizedEndDate" } },
                            { $dateFromString: { dateString: { $dateToString: { date: "$$NOW", format: "%Y-%m-%d" } } } }
                          ]
                        },
                        then: "active",
                        else: "inactive"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $unset: ["normalizedEndDate", "normalizedCreationDate"]
        }
      ]
    );
}

export async function setIdentifierStatus() {
  return db.collection('identifiers')
    .updateMany(
      { active: { $ne: false } },
      [
        {
          $addFields: {
            normalizedEndDate: {
              $switch: {
                branches: [
                  {
                    case: {
                      $regexMatch: {
                        input: "$endDate",
                        regex: /^\d{4}$/
                      }
                    },
                    then: {
                      $concat: ["$endDate", "-12-31"]
                    }
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: "$endDate",
                        regex: /^\d{4}-\d{2}$/
                      }
                    },
                    then: {
                      $let: {
                        vars: {
                          year: { $substr: ["$endDate", 0, 4] },
                          month: { $substr: ["$endDate", 5, 2] }
                        },
                        in: {
                          $concat: [
                            "$endDate",
                            "-",
                            {
                              $switch: {
                                branches: [
                                  {
                                    case: { $in: ["$$month", ["04", "06", "09", "11"]] },
                                    then: "30"
                                  },
                                  {
                                    case: { $eq: ["$$month", "02"] },
                                    then: {
                                      $cond: {
                                        if: {
                                          $eq: [
                                            { $mod: [{ $toInt: "$$year" }, 4] },
                                            0
                                          ]
                                        },
                                        then: "29",
                                        else: "28"
                                      }
                                    }
                                  }
                                ],
                                default: "31"
                              }
                            }
                          ]
                        }
                      }
                    }
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: "$endDate",
                        regex: /^\d{4}-\d{2}-\d{2}$/
                      }
                    },
                    then: "$endDate"
                  }
                ],
                default: null
              }
            }
          }
        },
        // Set active field based on normalizedEndDate
        {
          $set: {
            active: {
              $cond: {
                if: { $eq: ["$normalizedEndDate", null] },
                then: true,
                else: {
                  $gt: [
                    { $dateFromString: { dateString: "$normalizedEndDate" } },
                    { $dateFromString: { dateString: { $dateToString: { date: "$$NOW", format: "%Y-%m-%d" } } } }
                  ]
                }
              }
            }
          }
        },
        {
          $unset: "normalizedEndDate"
        },
      ]
    );
}
