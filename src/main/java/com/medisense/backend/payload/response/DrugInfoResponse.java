package com.medisense.backend.payload.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DrugInfoResponse {
    
    @JsonProperty("drugGroup")
    private DrugGroup drugGroup;

    public DrugGroup getDrugGroup() {
        return drugGroup;
    }
    

    public void setDrugGroup(DrugGroup drugGroup){
        this.drugGroup = drugGroup;
    }

    public static class DrugGroup {
        @JsonProperty("conceptProperties") 
        private List<DrugConcept> conceptProperties;

        public List<DrugConcept> getConceptProperties() {
            return conceptProperties;
        }

        public void setConceptProperties(List<DrugConcept> conceptProperties) {
            this.conceptProperties = conceptProperties;
        }
    }

    public static class DrugConcept {
        @JsonProperty("name")
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
