package com.asociacion.Utils;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.asociacion.models.Config;
import com.asociacion.models.Fee;

import com.asociacion.models.Member;
import com.asociacion.services.ConfigServiceImp;
import com.asociacion.services.FeeServiceImp;
import com.asociacion.services.MemberServiceImp;

@Component
public class Utils {

    @Autowired
    private FeeServiceImp feeServiceImp;

    @Autowired
    private MemberServiceImp memberServiceImp;

    @Autowired
    private ConfigServiceImp configServiceImp;

    public void inactiveNotFee() {
        List<Member> members = memberServiceImp.getMembers();

        for (Member member : members) {
            List<Fee> feesMember = feeServiceImp.findByMemberId(member.getId());
            for (Fee fee : feesMember) {
                checkInactiveNotFee(fee.getId());
            }
        }

    }

    public void checkInactiveNotFee(Long feeId) {

        int actualYear = LocalDate.now().getYear();
        Optional<Config> configYearsForInactive = configServiceImp.findById(4L);
        int yearsForInactiveInt = Integer.parseInt(configYearsForInactive.get().getAttribute());
        int yearsForInactive = actualYear - yearsForInactiveInt;
        Optional<Fee> fee = feeServiceImp.findFeeById(feeId);
        Optional<Member> member = memberServiceImp.findById(fee.get().getMemberId());

        if (fee.get().getYear() >= yearsForInactive) {
            member.get().setActive(true);
        } else {
            member.get().setActive(false);
        }

        memberServiceImp.saveMember(member.get());
    }

}
